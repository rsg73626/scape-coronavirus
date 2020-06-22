
var ElementType = {
    person: 0,
    coronavirus: 1,
    obstacle: 2,
    coronavirusPath: 3
}

class BoardPosition {

    constructor(x, y) {
        this.x = x
        this.y = y
        this.element = null
    }

}

class BoardNode extends Node {

    constructor(boardPosition, weight = null) {
        super(boardPosition, weight)
    }

    getConnectionWithPosition(x, y) {
        var nodeIndex = this.connections.findIndex(connection => connection.value.x == x && connection.value.y == y)
        if (nodeIndex > -1) {
            return this.connections[nodeIndex]
        }
        return null
    }

    getUpNode() {
        if (this.connections.length == 4) {
            return this.connections[0]
        }
        return this.getConnectionWithPosition(this.value.x, this.value.y - 1)
    }

    getLeftNode() {
        if (this.connections.length == 4) {
            return this.connections[1]
        }
        return this.getConnectionWithPosition(this.value.x - 1, this.value.y)
    }

    getBottomNode() {
        if (this.connections.length == 4) {
            return this.connections[2]
        }
        return this.getConnectionWithPosition(this.value.x, this.value.y + 1)
    }

    getRightNode() {
        if (this.connections.length == 4) {
            return this.connections[3]
        }
        return this.getConnectionWithPosition(this.value.x + 1, this.value.y)
    }

    setElement(element) {
        if (element != null && element != ElementType.person && element != ElementType.coronavirus && element != ElementType.obstacle && element != ElementType.coronavirusPath) {
            return
        } 
        this.value.element = element
    }

    hasObstacle() {
        return this.value.element == ElementType.obstacle
    }

    hasCoronavirusPath() {
        return this.value.element == ElementType.coronavirusPath
    }

    canReachPerson() {
        if (this.value.element == ElementType.coronavirus) {
            return this.connections.findIndex(connection => connection.weight != null) > -1
        }
        return this.connections.findIndex(connection => connection.value.element == ElementType.person) > -1
    }

    getFirstConnectionWithTheLowestWeight() {
        if (this.connections.length == 0) {
            return null
        }
        var filteredAndSortedConnections = this.connections.filter(function(connection) {
            return connection.weight != null
        }).sort(function(a, b) {
            return a.weight - b.weight
        })
        return filteredAndSortedConnections.length > 0 ? filteredAndSortedConnections[0] : null
    }

}

class Board extends Graph {

    constructor(size) {
        super()

        this.size                = size
        this.nodeWithPerson      = null
        this.nodeWithCoronavirus = null
        this.nodesWithObstacle   = []
        this.coronavirusPath     = []

        var i = 0
        var j = 0

        for (i = 0; i < size; i++) {
            for (j = 0; j < size; j++) {
                var position = new BoardPosition(i, j)
                var node     = new BoardNode(position)
                this.addNode(node)

                if (j > 0) {
                    node.addConnection(this.nodes[(i * size) + j - 1])
                }

                if (i > 0) {
                    node.addConnection(this.nodes[((i - 1) * size) + j])
                }
            }
        }

        var checkCompletionFunction = function (board) { //console.log('check completion function')
            return board.coronavirusPath.length > 0 && board.coronavirusPath[board.coronavirusPath.length - 1].canReachPerson()
        }
    
        var checkAssignmentFunction = function (board, node, value) { //console.log('check assignment function'); //console.log(node)
            return node.value.element == null
        }
    
        var getNextUnassignedNodeFunction = function (board) { //console.log('get next unassigned node function')
            if (board.coronavirusPath.length > 0) {
                return board.coronavirusPath[board.coronavirusPath.length - 1].getFirstConnectionWithTheLowestWeight()
            }
            return board.nodeWithCoronavirus.getFirstConnectionWithTheLowestWeight()
        }
    
        var assignFunction = function (board, node, value) { //console.log('assign function'); //console.log(node)
            board.setElementInNodeAtPosition(value, node.value.x, node.value.y)
        }
    
        var unassignFunction = function (board, node, value) { //console.log('unassign function'); //console.log(node)
            board.removeCoronavirusPathAtPosition(node.value.x, node.value.y)
        }
    
        this.coronavirusPathCSP =  new CSP(this,
                                           [ElementType.coronavirusPath],
                                           checkCompletionFunction,
                                           checkAssignmentFunction,
                                           getNextUnassignedNodeFunction,
                                           assignFunction,
                                           unassignFunction)

    }

    printBoard() {

        if (this.nodes.length > 1000) {
            console.log('The board is too large to be printed.')
            return
        }

        this.nodes.forEach(function(node) {
            console.log(node.value)
            console.log('Left node: ')
            console.log(node.getLeftNode())
            console.log('Up node: ')
            console.log(node.getUpNode())
            console.log('Right node: ')
            console.log(node.getRightNode())
            console.log('Bottom node: ')
            console.log(node.getBottomNode())
            console.log('\n')
        })
    }

    printBoardWeights() {

        if (this.nodes.length > 1000) {
            console.log('The graph is too large to be printed.')
            return
        }

        var currentLineStart = this.nodes[0]
        var currentColumnNode = currentLineStart

        while (currentLineStart != null) {

            var lineString = ''

            while (currentColumnNode != null) { 
                var currentWeight = currentColumnNode.weight
                var weightToPrint = '--'
                if (currentWeight != null) {
                    weightToPrint = currentWeight >= 10 ? currentWeight : '0' + currentWeight
                }

                lineString += weightToPrint + ' '

                currentColumnNode = currentColumnNode.getRightNode()
            }

            console.log(lineString + '\n')
            currentLineStart = currentLineStart.getBottomNode()
            currentColumnNode = currentLineStart
        }

    }

    printCoronavirusPath() {

        if (this.nodes.length > 1000) {
            console.log('The graph is too large to be printed.')
            return
        }

        var currentLineStart = this.nodes[0]
        var currentColumnNode = currentLineStart

        while (currentLineStart != null) {

            var lineString = ''

            while (currentColumnNode != null) { 
                var currentWeight = currentColumnNode.weight
                var weightToPrint = '--'
                if (currentWeight != null) {
                    weightToPrint = currentWeight >= 10 ? currentWeight : '0' + currentWeight
                }

                if (this.coronavirusPath.findIndex(path => path.id == currentColumnNode.id) > -1) {
                    weightToPrint = 'cp'
                }

                lineString += weightToPrint + ' '

                currentColumnNode = currentColumnNode.getRightNode()
            }

            console.log(lineString + '\n')
            currentLineStart = currentLineStart.getBottomNode()
            currentColumnNode = currentLineStart
        }

    }

    getNodeWithPosition(x, y) {
        if (x < this.size && y < this.size) {
            return this.nodes[(x * this.size) + y]
        }
        return null
    }

    setElementInNodeAtPosition(element, x, y) {
        if (element != ElementType.person && element != ElementType.coronavirus && element != ElementType.obstacle && element != ElementType.coronavirusPath) {
            return
        }
        
        var node = this.getNodeWithPosition(x, y)

        if (node != null && node.value.element == null) {

            switch (element) {
                case ElementType.person:
                    if (this.nodeWithPerson != null) {
                        this.nodeWithPerson.setElement(null)
                    }
                    node.setElement(element)
                    this.nodeWithPerson = node
                    break
                
                case ElementType.coronavirus: 
                    if (this.nodeWithCoronavirus != null) {
                        this.nodeWithCoronavirus.setElement(null)
                    }
                    node.setElement(element)
                    this.nodeWithCoronavirus = node
                    break

                case ElementType.obstacle: 
                    node.setElement(element)
                    this.nodesWithObstacle.push(node)
                    break

                case ElementType.coronavirusPath:
                    node.setElement(element)
                    this.coronavirusPath.push(node)
                    break

                default:
                    break
            }

        }
    }

    addObstacleAtPosition(x, y) {
        this.setElementInNodeAtPosition(ElementType.obstacle, x, y)
    }

    removeObstacleAtPosition(x, y) {
        var node = this.getNodeWithPosition(x, y)

        if (node != null && node.value.element == ElementType.obstacle) { 
            node.setElement(null)
        }

        var nodeWithObstacleIndex = this.nodesWithObstacle.findIndex(n => n.id == node.id)
        if (nodeWithObstacleIndex > -1) {
            this.nodesWithObstacle.splice(nodeWithObstacleIndex, 1)
        }
    }

    removeCoronavirusPathAtPosition(x, y) {
        var node = this.getNodeWithPosition(x, y)

        if (node != null && node.value.element == ElementType.coronavirusPath) { 
            node.setElement(null)
        }

        var nodeWithPathIndex = this.coronavirusPath.findIndex(n => n.id == node.id)
        if (nodeWithPathIndex > -1) {
            this.coronavirusPath.splice(nodeWithPathIndex, 1)
        }
    }

    removeAllCoronavirusPathNodes() {
        this.coronavirusPath.forEach(pathNode => pathNode.setElement(null))
        this.coronavirusPath = []
    }

    updateNodesWeight() {
        if (this.nodeWithPerson == null || this.nodeWithCoronavirus == null) {
            console.error('It\'s necessary to have the node with Person and the node with Coronavírus to update the nodes weight.')
            return
        }

        this.nodes.forEach(node => node.weight = null)

        function setNodeWeight(node) { 
            var connectionWithTheLowestWeight = node.getFirstConnectionWithTheLowestWeight() 
            if (connectionWithTheLowestWeight != null) {
                node.weight = connectionWithTheLowestWeight.weight + 1
            }
            node.connections.filter(function(connection) {
                return connection.value.element == null && (connection.weight == null || connection.weight > node.weight)
            }).forEach(function(connection) {
                setNodeWeight(connection)
            })
        }

        this.nodeWithPerson.weight = 0
        this.nodeWithPerson.connections.filter(function(connection) {
            return connection.value.element == null && (connection.weight == null || connection.weight > 0)
        }).forEach(function(connection) {
            setNodeWeight(connection)
        })
    }

    calculateCoronavirusPath() {
        if (this.nodeWithPerson == null || this.nodeWithCoronavirus == null) {
            console.error('It\'s necessary to have the node with Person and the node with Coronavírus to update the nodes weight.')
            return
        }
        
        return this.coronavirusPathCSP.solve()
    }

    reset() {
        this.removeAllCoronavirusPathNodes()
        this.nodesWithObstacle.forEach(node => node.setElement(null))
        this.nodesWithObstacle = []
    }

}
