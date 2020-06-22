
function createBrazilRegionsGraph() {
    var north     = new Node('North')
    var northeast = new Node('Northeast')
    var center    = new Node('Center') 
    var southeast = new Node('Sutheast')
    var south     = new Node('South')

    north.addConnections([northeast, center])
    northeast.addConnections([center, southeast])
    center.addConnections([southeast, south])
    southeast.addConnections([south])

    var brazil = new Graph()
    brazil.addNode(north)
    brazil.addNode(northeast)
    brazil.addNode(center)
    brazil.addNode(southeast)
    brazil.addNode(south)

    return brazil
}

var br = createBrazilRegionsGraph()
// br.print()

var wrongNode = new Node('Wrong')
wrongNode.addConnections(br.nodes)
br.addNode(wrongNode)
// br.print()

br.removeNode(wrongNode)
br.print()