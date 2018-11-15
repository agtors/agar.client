class Region {

    constructor(id, x, y, size, wsUri) {

        this.x = x
        this.y = y
        this.size = size
        this.color = getRandomColor()
        this.gridHelper = new THREE.GridHelper(size, size / 10, this.color, this.color)
        this.gridHelper.position.set(x, y, 0)

        this.player = new Map()
        this.energy = new Map()

        /*this.websocket = new WebSocket(wsUri)
        websocket.onopen = this.onOpen
        websocket.onclose = this.onClose
        websocket.onmessage = this.onMessage
        websocket.onerror = this.onError*/
    }

    grid() {
        return this.gridHelper
    }

    updateEntities() {

    }

    _updatePlayers() {

    }
    
    _upddateEnergies() {

    }

    onOpen(evt)
    {
        console.log("connected to ${this.wsUri}")
    }

    onClose(evt)
    {
        console.log("disconnected to ${this.wsUri}")
    }

    onmessage(data)
    {
        console.log(data)
    }

    onError(evt)
    {
        this.websocket.close()
        console.log(evt)
    }
}

class Player {

    constructor(position, velocity, weight, actorRef) {
        this.position = position
        this.velocity = velocity
        this.weight = weight
        this.color = getRandomColor()
        this.actorRef = actorRef

        let geometry = new THREE.SphereGeometry(this.weight, 32, 32)
        let material = new THREE.MeshBasicMaterial({ color: this.color })
        this.mesh = new THREE.Mesh(geometry, material)
    }

    updatePosition(position, velocity) {
        this.position = position
        this.velocity = velocity        
    }

    getMesh() {
        return this.mesh
    }
}

class Energy {
    constructor(position, power, actorRef) {
        this.position = position
        this.power = power
        this.color = getRandomColor()
        this.actorRef = actorRef

        let geometry = new THREE.BoxGeometry(1, 1, 1)
        let material = new THREE.MeshBasicMaterial({color: this.color})
        this.mesh = new THREE.Mesh( geometry, material)
    }
}

function getRandomColor() {
    return new THREE.Color(Math.random() * 0xffffff)
}
