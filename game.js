class Region {

    constructor(id, x, y, size, wsUri, scene) {

        this.x = x
        this.y = y
        this.size = size
        this.color = getRandomColor()
        this.gridHelper = new THREE.GridHelper(size, size / 10, this.color, this.color)
        this.gridHelper.position.set(x + size/2, y, -size/2)

        this.players = new Map()
        this.energies = new Map()

        this.wsUri = wsUri

        this.websocket = new WebSocket(wsUri)
        this.websocket.onopen = this.onOpen
        this.websocket.onclose = this.onClose
        this.websocket.onmessage = this.onMessage
        this.websocket.onerror = this.onError
        this.websocket.region = this //TODO: please forgive me but Websocket override the this scope so it's not possible to use region methods without this trick

        this.scene = scene
    }

    grid() {
        return this.gridHelper
    }

    _updatePlayers(playersInfos) {
        playersInfos.forEach(p => {
	  let player = this.players.get(p.ref)

	  if (player !== undefined) {
	      console.log(`player ${p.ref} moved at position x: ${p.position.x} y: ${p.position.y} and weight of ${p.weight}`)
	      player.position = p.position
	      player.velocity = p.velocity
	      player.weight = p.weight
	      player.mesh.geometry.radius = p.weight
	      player.mesh.position.set(p.position.y, p.weight / 2, -p.position.x)
	  }
	  else {
	      let player = new Player(p.position, 0, p.weight, p.ref)
	      this.players.set(p.ref, player)
	      this.scene.add(player.getMesh())
	  }
        })

        //remove dead players
        playersInfos.forEach(p => {
	  if(!this.players.has(p.ref)) {
	      this.scene.remove(this.players.get(p.ref).getMesh())
	      this.players.delete(p.ref)
	  }
        })
    }

    _updateEnergies(energiesInfos) {
        energiesInfos.forEach(e => {
	  let energy = this.energies.get(e.ref)

	  if(energy !== undefined) {
	      // Should not change
	      energy.position = e.position
	      energy.value = e.value
	      energy.mesh.position.set(e.position.y, 4, -e.position.x)
	  }
	  else {
	      let energy = new Energy(e.position, e.value, e.ref)
	      this.energies.set(e.ref, energy)
	      this.scene.add(energy.mesh)
	  }
        })

        //remove consumed energies
        energiesInfos.forEach(e => {
	  if(!this.energies.has(e.ref)) {
	      this.scene.remove(this.energies.get(e.ref).getMesh())
	      this.energies.delete(e.ref)
	  }
        })
    }

    onOpen(evt) {
        console.log(`trying to connect on ${this.url}...`, evt)
    }

    onClose(evt) {
        console.log(`disconnected to ${this.url}`, evt)
    }

    onMessage(rawData) {
        let data = JSON.parse(rawData.data);
        this.region._updatePlayers(data[0])
        this.region._updateEnergies(data[1])
    }

    onError(evt) {
        this.websocket.close()
        console.log(evt)
    }
}

class Player {

    constructor(position, velocity, weight, actorRef) {
        console.log(`create the new player ${actorRef} at x:${position.x} y:${position.y} and with a weight of ${weight}`)
        this.position = position
        this.velocity = velocity
        this.weight = weight
        this.color = getRandomColor()
        this.actorRef = actorRef

        let geometry = new THREE.SphereGeometry(this.weight, 32, 32)
        let material = new THREE.MeshBasicMaterial({ color: this.color })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(position.y, weight / 2, -position.x)
    }

    getMesh() {
        return this.mesh
    }
}

class Energy {
    constructor(position, value, actorRef) {
        console.log(`create the new energy ${actorRef} at x:${position.x} y:${position.y} and with a value of ${value}`)
        this.position = position
        this.value = value
        this.color = getRandomColor()
        this.actorRef = actorRef

        let geometry = new THREE.BoxGeometry(8, 8, 8)
        let material = new THREE.MeshBasicMaterial({color: this.color})
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(position.y, 4, -position.x)
    }

    getMesh() {
        return this.mesh
    }
}

function getRandomColor() {
    return new THREE.Color(Math.random() * 0xffffff)
}
