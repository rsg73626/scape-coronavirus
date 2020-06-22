


var Place = function(name, color = null) {
    this.name  = name
    this.color = color
}

function createMap() {
    var north     = new Node(new Place('North'))
    var northeast = new Node(new Place('Northeast'))
    var center    = new Node(new Place('Center')) 
    var southeast = new Node(new Place('Sutheast'))
    var south     = new Node(new Place('South'))

    north.addConnections([northeast, center])
    northeast.addConnections([center, southeast])
    center.addConnections([southeast, south])
    southeast.addConnections([south])

    var map = new Graph()
    map.addNode(north)
    map.addNode(northeast)
    map.addNode(center)
    map.addNode(southeast)
    map.addNode(south)

    return map
}

function createMapCSP(map) {

    var domain = ['red', 'green', 'blue']
    
    var checkCompletionFunction = function (graph) {
        return graph.nodes.findIndex(node => node.value.color == null) == -1
    }

    var checkAssignmentFunction = function (graph, node, value) {
        return node.connections.findIndex(connection => connection.value.color == value) == -1
    }

    var getNextUnassignedNodeFunction = function (graph) {
        var indexOfNodeWithoutColor = graph.nodes.findIndex(node => node.value.color == null)
        if (indexOfNodeWithoutColor > -1) {
            return graph.nodes[indexOfNodeWithoutColor]
        }
        return null
    }

    var assignFunction = function (graph, node, value) {
        node.value.color = value
    }

    var unassignFunction = function (graph, node, value) {
        node.value.color = null
    }

    var mapCSP = new CSP(map, 
                         domain, 
                         checkCompletionFunction, 
                         checkAssignmentFunction, 
                         getNextUnassignedNodeFunction, 
                         assignFunction, 
                         unassignFunction)
                        
    return mapCSP
}

var map = createMap()
var csp = createMapCSP(map)
csp.solve()
csp.graph.print()