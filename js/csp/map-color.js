
/*
CSP – exemplo

    No arquivo “./js/csp/map-colors.js”, a classe apresentada anteriormente foi utilizada 
para resolver o problema de pintura de um mapa com a restrição de cores diferentes para 
áreas fronteiriças (problema apresentado na seção da Figura 1). Para tanto, foi criado 
um grafo representando as cinco regiões do Brasil, e as ligações entre elas. Também foi 
criado uma nova classe, Place, com as propriedades name e color, para ser utilizada 
como tipo de valor dos nós do grafo. Dessa maneira, cada região do país é representada 
por um nó do grafo, cujo valor é uma instância de Place, contendo o nome da região e a 
propriedade color inicialmente nula. A seguir, a explicação da implementação de cada 
um dos argumentos do CSP para resolver esse problema em específico:

    •	graph: representa o mapa das cinco regiões do brasil.

    •	domain: uma lista contendo as strings red, green e blue (cores para pintar o mapa).

    •	checkCompletionFunction: verifica se todos os nós do grafo já possuem uma cor atribuída.
Se sim, significa que a solução foi encontrada.

    •	checkAssignmentFunction: verifica se o nó possui alguma conexão cujo valor da cor é
igual ao valor que está se tentando atribuir para o nó em questão. Se encontrar alguma conexão 
com esse valor, significa que não é possível atribuir esse valor para esse nó. 

    •	getNextUnassignedNodeFunction: retorna o primeiro nó do grafo cujo valor da 
propriedade color ainda é nulo.

    •	assignFunction: atribui o valor recebido à propriedade color do objeto na propriedade value 
do nó do grafo em questão.

    •	unassignFunction: atribui nulo à propriedade color do objeto na propriedade value do nó do grafo em questão. 

*/

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