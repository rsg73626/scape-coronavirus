


class CSP {

    constructor(graph, 
                domain, 
                checkCompletionFunction, 
                checkAssignmentFunction, 
                getNextUnassignedNodeFunction, 
                assignFunction, 
                unassignFunction) {

            this.graph  = graph
            this.domain = domain

            this.checkCompletionFunction       = checkCompletionFunction
            this.checkAssignmentFunction       = checkAssignmentFunction
            this.getNextUnassignedNodeFunction = getNextUnassignedNodeFunction
            this.assignFunction                = assignFunction
            this.unassignFunction              = unassignFunction

    }

    solve() {
    
        var csp = this
    
        function recursiveBacktracking() {
            if (csp.checkCompletionFunction(csp.graph)) {
                return true
            }
            
            var unassignedNode = csp.getNextUnassignedNodeFunction(csp.graph)
            if (unassignedNode == null) {
                return false
            }
    
            var i = 0
            for (i = 0; i < csp.domain.length; i++) {
                var value = csp.domain[i]
                if (csp.checkAssignmentFunction(csp.graph, unassignedNode, value)) {
                    csp.assignFunction(csp.graph, unassignedNode, value)
                    var result = recursiveBacktracking()
                    if (result) {
                        return true
                    }
                    csp.unassignFunction(csp.graph, unassignedNode, value)
                }
            }
    
            return false
        }
    
        return recursiveBacktracking()
    
    }

}