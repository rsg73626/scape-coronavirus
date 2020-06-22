


class Node {

    // static _id = 0

    constructor(value = null, weight = null) {
        this.id          = ++Node._id
        this.value       = value
        this.weight      = weight
        this.connections = []
    }

    containsConnectionWithNode(node) {
        var indexOfNode = this.connections.findIndex(connection => connection.id == node.id)
        return indexOfNode > -1
    }

    addConnection(node) {
        if (!this.containsConnectionWithNode(node)) {
            this.connections.push(node)
            node.connections.push(this)
        }
    }

    addConnections(nodes) {
        nodes.forEach(node => this.addConnection(node))
    }

    removeConnection(node) {
        var indexOfNode = this.connections.findIndex(connection => connection.id == node.id)
        if (indexOfNode > -1) {
            var connectionToRemove = this.connections[indexOfNode]
            this.connections.splice(indexOfNode, 1)
            connectionToRemove.removeConnection(this)
        }
    }
    
}

Node._id = 0



class Graph {

    constructor(nodes = []) {
        this.nodes = nodes
    }

    containsNode(node) {
        var indexOfNode = this.nodes.findIndex(n => n.id == node.id)
        return indexOfNode > -1
    }
    
    addNode(node) {
        if (!this.containsNode(node)) {
            this.nodes.push(node)
        }
    }
    
    removeNode(node) {
        var indexOfNode = this.nodes.findIndex(n => n.id == node.id)
        if (indexOfNode > -1) {
            var nodeToRemove = this.nodes[indexOfNode]
            this.nodes.splice(indexOfNode, 1)
            this.nodes.forEach(n => n.removeConnection(nodeToRemove))
        }
    }
    
    print() {

        if (this.nodes.length > 1000) {
            console.log('The graph is too large to be printed.')
            return
        }

        this.nodes.forEach(function(node) {
            console.log(node.value)
            console.log(node.weight)
            console.log('Node connections:')
            node.connections.forEach(function(connection) {
                console.log(connection.value)
                console.log(connection.weight)
            })
            console.log('\n')
        })
    }

}
