
var gameView = null

function createGameViewWithBoardSize(boardSize) {
    var globalVariablesStyleTag = document.getElementById('global-variables')
    if (globalVariablesStyleTag != null) {
        globalVariablesStyleTag.textContent = 'body { --board-size: ' + boardSize + '; }' + globalVariablesStyleTag.textContent
    }

    gameView = new GameView('game-area', boardSize)

    gameView.controller.board.setElementInNodeAtPosition(ElementType.person, 0, 0)
    gameView.controller.board.setElementInNodeAtPosition(ElementType.coronavirus, boardSize - 1, boardSize -1)
    gameView.addPersonAtPosition(gameView.controller.board.nodeWithPerson.value.x, gameView.controller.board.nodeWithPerson.value.y)
    gameView.addCoronavirusAtPosition(gameView.controller.board.nodeWithCoronavirus.value.x, gameView.controller.board.nodeWithCoronavirus.value.y)
    // gameView.removePersonAtPosition(gameView.controller.board.nodeWithPerson.value.x, gameView.controller.board.nodeWithPerson.value.y)
    // gameView.removeCoronavirusAtPosition(gameView.controller.board.nodeWithCoronavirus.value.x, gameView.controller.board.nodeWithCoronavirus.value.y)
    // gameView.controller.board.updateNodesWeight()
    // gameView.controller.board.printBoardWeights()
}
