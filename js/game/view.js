


class GameView {

    constructor(gameViewTagId, boardSize) {
        this.view = document.getElementById(gameViewTagId)

        if (this.view == null) {
            console.error('Invalid game view tag id: ' + gameViewTagId + '\nThe game view tag id must be an string pointing to the id of an existing HTML tag where the game view is going to be created.')
            return
        }
        if ((typeof boardSize) != 'number') {
            console.error('Invalid board size value: ' + boardSize + '\nThe board size must be a numerical value between 5 and 1000.')
            return
        }
        if (boardSize < 5 && boardSize > 1000) {
            console.error('Invalid board size value: ' + boardSize + '. \nThe board size must be a value between 5 and 1000.')
            return
        }

        this.controller = new GameViewController(boardSize)
        this.controller.view = this

        var tableTag = document.createElement('TABLE')
        tableTag.setAttribute('id', 'board')
        var i = 0
        var j = 0
        for (i = 0; i < boardSize; i++) {
            var rowTag = document.createElement('TR')
            rowTag.setAttribute('id', 'line' + i)
            rowTag.setAttribute('class', 'lines')
            for (j = 0; j < boardSize; j++) {
                var dataTag = document.createElement('TD')
                dataTag.setAttribute('id','line' + i + 'col' + j)
                dataTag.setAttribute('class', 'cols')
                dataTag.setAttribute('onclick', 'gameView.controller.didClickOnBoardPosition(' + j + ', ' + i + ')')
                rowTag.appendChild(dataTag)
            }
            tableTag.appendChild(rowTag)
        }
        this.view.append(tableTag)

        var sectionTag = document.createElement('SECTION')
        var obstacleFigureTag = document.createElement('FIGURE')
        obstacleFigureTag.setAttribute('id', 'obstacle-figure')
        obstacleFigureTag.setAttribute('onclick', 'gameView.controller.didClickOnObstacleLegend()')
        var obstacleFigureCaptionTag = document.createElement('FIGCAPTION')
        obstacleFigureCaptionTag.setAttribute('id', 'obstacle-figure-caption')
        obstacleFigureCaptionTag.textContent = this.controller.obstacles
        obstacleFigureTag.appendChild(this.getNewObstacleImageTag())
        obstacleFigureTag.appendChild(obstacleFigureCaptionTag)
        sectionTag.appendChild(obstacleFigureTag)

        var coronavirusFigureTag = document.createElement('FIGURE')
        coronavirusFigureTag.setAttribute('id', 'coronavirus-figure')
        coronavirusFigureTag.setAttribute('onclick', 'gameView.controller.didClickOnCoronavirusLegend()')
        var coronavirusFigureCaptionTag = document.createElement('FIGCAPTION')
        coronavirusFigureCaptionTag.setAttribute('id', 'coronavirus-figure-caption')
        coronavirusFigureCaptionTag.textContent = this.controller.coronavirusMovements
        coronavirusFigureTag.appendChild(this.getNewCoronavirusTag())
        coronavirusFigureTag.appendChild(coronavirusFigureCaptionTag)
        sectionTag.appendChild(coronavirusFigureTag)

        this.view.append(sectionTag)

        var buttonTag = document.createElement('BUTTON')
        buttonTag.setAttribute('id', 'game-button')
        buttonTag.setAttribute('onclick', 'gameView.controller.didClickOnPlayButton()')
        buttonTag.textContent = 'JOGAR'
        this.view.append(buttonTag)
    }

    getNewImageTagForImageWithName(imageName, alternativeText = 'Game element image.', id = null, cls = 'game-elements') {
        var imageTag = Resources.Images.getNewImageTagForImageWithName(imageName)
        imageTag.setAttribute('alt', alternativeText)
        if (id != null) {
            imageTag.setAttribute('id', id)
        }
        if (cls != null) {
            imageTag.setAttribute('class', cls)
        }
        return imageTag
    }

    getNewPersonImageTag() {
        return this.getNewImageTagForImageWithName('person.svg', 'Person', 'person')
    }

    getNewCoronavirusTag() {
        return this.getNewImageTagForImageWithName('coronavirus.svg', 'Coronavírus', 'coronavirus')
    }

    getNewObstacleImageTag() {
        return this.getNewImageTagForImageWithName('obstacle.svg', 'Obstacle', null, 'obstacle')
    }

    getNewInfectedPersonImageTag() {
        return this.getNewImageTagForImageWithName('infectedperson.svg', 'Infected Person', 'person')
    }

    addElementAtPosition(element, x, y) {
        var tag = document.getElementById('line' + y + 'col' + x)
        if (tag == null) {
            console.error('Couldn\'t find tag at position: (' + x + ', ' + y + '. ')
            return
        }
        tag.appendChild(element)
    }

    addPersonAtPosition(x, y) {
        this.addElementAtPosition(this.getNewPersonImageTag(), x, y)
        var tag = document.getElementById('line' + y + 'col' + x)
        if (tag != null) {
            tag.setAttribute('class', (tag.getAttribute('class') ?? '') + ' ' + 'col-with-person')
        }
    }

    removePersonAtPosition(x, y) {
        var tag = document.getElementById('line' + y + 'col' + x)
        if (tag == null) {
            console.error('Couldn\'t find tag at position: (' + x + ', ' + y + '. ')
            return
        }
        tag.removeChild(tag.childNodes[0])
        tag.setAttribute('class', (tag.getAttribute('class') ?? '').replace(' col-with-person', ''))
    }

    addCoronavirusAtPosition(x, y) {
        this.addElementAtPosition(this.getNewCoronavirusTag(), x, y)
        var tag = document.getElementById('line' + y + 'col' + x)
        if (tag != null) {
            tag.setAttribute('class', (tag.getAttribute('class') ?? '') + ' ' + 'col-with-coronavirus')
        }
    }

    removeCoronavirusAtPosition(x, y) {
        var tag = document.getElementById('line' + y + 'col' + x)
        if (tag == null) {
            console.error('Couldn\'t find tag at position: (' + x + ', ' + y + '. ')
            return
        }
        tag.removeChild(tag.childNodes[0])
        tag.setAttribute('class', (tag.getAttribute('class') ?? '').replace(' col-with-coronavirus', ''))
    }

    addObstacleAtPosition(x, y) {
        this.addElementAtPosition(this.getNewObstacleImageTag(), x, y)
        var tag = document.getElementById('line' + y + 'col' + x)
        if (tag != null) {
            tag.setAttribute('class', (tag.getAttribute('class') ?? '') + ' ' + 'cols-with-obstacle')
        }
    }

    removeObstacleAtPosition(x, y) {
        var tag = document.getElementById('line' + y + 'col' + x)
        if (tag == null) {
            console.error('Couldn\'t find tag at position: (' + x + ', ' + y + '. ')
            return
        }
        tag.removeChild(tag.childNodes[0])
        tag.setAttribute('class', (tag.getAttribute('class') ?? '').replace(' cols-with-obstacle', ''))
    }

    setObstacleCount(value) {
        var countTag = document.getElementById('obstacle-figure-caption')
        if (countTag != null) {
            countTag.textContent = value
        }
    }

    setCoronavirusCount(value) {
        var countTag = document.getElementById('coronavirus-figure-caption')
        if (countTag != null) {
            countTag.textContent = value
        }
    }

    addCoronavirusPathAtPosition(x, y, callback) {
        var boardPositionTag = document.getElementById('line' + y + 'col' + x)
        if (boardPositionTag == null) {
            return
        }

        var coronavirusPathTag = this.getNewCoronavirusTag()
        coronavirusPathTag.setAttribute('style', 'opacity: 0;')
        coronavirusPathTag.setAttribute('class', 'game-elements')
        boardPositionTag.append(coronavirusPathTag)
        boardPositionTag.setAttribute('class', (boardPositionTag.getAttribute('class') ?? '') + ' cols-with-coronavirus-path')

        var currentOpacityValue = 0
        var opacityAnimationIntervalId = setInterval(incrementOpacity, 100)
        function incrementOpacity() {
            if (currentOpacityValue >= 1) {
                clearInterval(opacityAnimationIntervalId)
                if (callback != null) {
                    callback()
                }
            } else {
                currentOpacityValue += 0.2
                coronavirusPathTag.setAttribute('style', 'opacity: ' + currentOpacityValue + ';')
            }
        }

    }

    blockBoard() {
        var colTags = document.getElementsByTagName('td')
        var size = colTags.length
        var i
        for (i = 0; i < size; i++) {
            var tag = colTags[i]
            tag.setAttribute('class', (tag.getAttribute('class') ?? '') + ' blocked')
        }
    }

    unblockBoard() {
        var blockedTags = document.getElementsByTagName('td')
        var size = blockedTags.length
        var i
        for (i = 0; i < size; i++) {
            var tag = blockedTags[i]
            tag.setAttribute('class', (tag.getAttribute('class') ?? '').replace(' blocked', ''))
        }
    }

    setGameButtonTitle(title = 'JOGAR') {
        var gameButton = document.getElementById('game-button')
        if (gameButton != null) {
            gameButton.textContent = title
        }
    }

    setGameButtonDisabled(value = true) {
        var gameButton = document.getElementById('game-button')
        if (gameButton != null) {
            gameButton['disabled'] = value
        }
    }

    setInfectedPerson() {
        var personTag = document.getElementById('person')
        if (personTag != null) {
            personTag.setAttribute('src', Resources.Images.getPathForImageWithName('infectedperson.svg'))
        }
    }

    resetPerson() {
        var personTag = document.getElementById('person')
        if (personTag != null) {
            personTag.setAttribute('src', Resources.Images.getPathForImageWithName('person.svg'))
        }
    }

    reset() {
        var tags = Array.from(document.getElementsByClassName('cols-with-obstacle') ?? []).concat(Array.from(document.getElementsByClassName('cols-with-coronavirus-path') ?? []))
        var size = tags.length
        var i
        for (i = 0; i < size; i++) {
            var tag = tags[i]
            tag.removeChild(tag.childNodes[0])
            tag.setAttribute('class', tag.getAttribute('class').replace('cols-with-obstacle', ''))
            tag.setAttribute('class', tag.getAttribute('class').replace('cols-with-coronavirus-path', ''))
        }
        this.resetPerson()
    }

}

class GameViewController {

    /*
    static personMessage = ' 👦 PESSOA 👩 \n\n' +
                           ' ▪️ O triangulo amarelo representa a Pessoa. \n' + 
                           ' ▪️ Sua posição é fixa. \n' + 
                           ' ▪️ Seu objetivo é impedir que o Coronavírus chague até a Pessoa. \n' + 
                           ' ▪️ Faça isso colocando obstáculos entre a Pessoa e o Coronavírus no tabuleiro. \n' + 
                           ' ▪️ Adicione um obstáculo clicando em qualquer posição vazia do tabuleiro.'

    static shortCoronavirusMessage = ' 🦠 CORONAVÍRUS 🦠 \n\n' + 
                                     ' ▪️ O círculo verde representa o Coronavírus. \n' + 
                                     ' ▪️ Ele pode se mover para cima, para baixo, para esquerda e para a direita.'

    static coronavirusMessage = GameViewController.shortCoronavirusMessage + ' \n' + 
                                ' ▪️ Seu objetivo é impedir que o Coronavírus chague até a Pessoa. \n' + 
                                ' ▪️ Faça isso colocando obstáculos entre a Pessoa e o Coronavírus no tabuleiro. \n' + 
                                ' ▪️ Adicione um obstáculo clicando em qualquer posição vazia do tabuleiro.'

    static obstaclesMessage = ' 🚫 OBSTÁCULOS 🚫 \n\n' + 
                              ' ▪️ Os lonsagulos cinzas representam os obstáculos. \n' + 
                              ' ▪️ O Coronavírus não pode passar por um obstáculo. \n' +
                              ' ▪️ Posicione todos os obstáculos no tabueleiro e clique e "JOGAR". \n' + 
                              ' ▪️ Não é possível colocar obstáculos no tabuleiro enquanto o Coronavírus está se movendo.'    
    */

    constructor(boardSize) {
        this.board                    = new Board(boardSize)
        this.view                     = null
        this.obstacles                = boardSize
        this.leftObstacles            = boardSize
        this.coronavirusMovements     = boardSize * 2
        this.leftCoronavirusMovements = boardSize * 2

        this.isAnimating    = false
        this.didFinishAGame = false
        this.level          = 1
        this.nextLevel      = null
    }

    didClickOnBoardPosition(x, y) {
        var nodeAtPosition = this.board.getNodeWithPosition(x, y)

        if (nodeAtPosition === this.board.nodeWithPerson) {
            window.alert(GameViewController.personMessage)
            return
        }

        if (nodeAtPosition === this.board.nodeWithCoronavirus || nodeAtPosition.hasCoronavirusPath()) {
            window.alert(GameViewController.coronavirusMessage)
            return
        }

        if (this.isAnimating || this.didFinishAGame) {
            return
        }

        if (this.board.getNodeWithPosition(x, y).hasObstacle()) {
            this.board.removeObstacleAtPosition(x, y)
            this.view.removeObstacleAtPosition(x, y)
            this.leftObstacles += 1
            this.view.setObstacleCount(this.leftObstacles)
        } else if (this.leftObstacles > 0) {
            this.board.addObstacleAtPosition(x, y)
            this.view.addObstacleAtPosition(x, y)
            this.leftObstacles -= 1
            this.view.setObstacleCount(this.leftObstacles)
        }

    }

    didClickOnObstacleLegend() {
        window.alert(GameViewController.obstaclesMessage + ' \n ▪️ Você ainda pode colocar ' + this.leftObstacles + ' obstaculo(s) no tabuleiro para impedir que o Coronavírus chegue até a Pessoa.')
    }

    didClickOnCoronavirusLegend() {
        window.alert(GameViewController.shortCoronavirusMessage + ' \n ▪️ Quando você clicar em "JOGAR", o Coronavírus irá se mover ' + this.leftObstacles + ' vezes para tentar chegar até a Pessoa.')
    }

    didClickOnPlayButton() {

        if (this.isAnimating) {
            return
        }

        if (this.didFinishAGame) {
            this.didFinishAGame = false
            this.board.reset()
            this.view.reset()

            if (this.nextLevel != null) {
                this.level                = this.nextLevel
                this.nextLevel            = null
                this.obstacles            += 5
                this.coronavirusMovements += 5    
            } else {
                this.level                = 1
                this.obstacles            = this.board.size
                this.coronavirusMovements = this.board.size * 2
            }

            this.leftObstacles            = this.obstacles
            this.leftCoronavirusMovements = this.coronavirusMovements

            this.view.setObstacleCount(this.leftObstacles)
            this.view.setCoronavirusCount(this.leftCoronavirusMovements)
            this.view.setGameButtonTitle()
            return
        }

        this.board.updateNodesWeight()

        if (this.checkIfThereIsPathBetweenCoronavirusAndPerson()) {
            this.view.setGameButtonDisabled(true)
            this.view.blockBoard()
            this.view.setGameButtonTitle('JOGANDO...')
            this.executeGame()
        }

    }

    decreaseCoronavirusMovementsCount() {
        this.leftCoronavirusMovements -= 1
        this.view.setCoronavirusCount(this.leftCoronavirusMovements)
    }

    executeGame() {
        var pathResult = this.board.calculateCoronavirusPath()
        if (pathResult && this.board.coronavirusPath.length > 0) {
            this.isAnimating = true

            var path  = this.board.coronavirusPath.map(pathNode => pathNode.value)
            var index = 0
            var view  = this.view
            
            function callback() {
                index += 1
                if (index < path.length && view.controller.leftCoronavirusMovements > 0) {
                    view.controller.decreaseCoronavirusMovementsCount()
                    view.addCoronavirusPathAtPosition(path[index].x, path[index].y, callback)
                } else {
                    if (view.controller.leftCoronavirusMovements > 0) {
                        view.setInfectedPerson()
                        view.controller.decreaseCoronavirusMovementsCount()
                    }

                    view.controller.isAnimating = false

                    view.controller.endGame()
                }
            }

            this.decreaseCoronavirusMovementsCount()
            view.addCoronavirusPathAtPosition(path[index].x, path[index].y, callback)

        }
    }

    endGame() {
        this.view.unblockBoard()
        this.didFinishAGame = true

        // GAME OVER
        if (this.board.coronavirusPath.length + 1 <= this.coronavirusMovements) {
            this.view.setGameButtonTitle('RECOMEÇAR')
            this.view.setGameButtonDisabled(false)
            var id = setTimeout(function(){
                window.alert(' 😕 FIM DE JOGO 🤒 \nVocê não conseguiu impedir que o Coronavírus infectasse a Pessoa.\nClique em "RECOMEÇAR" e tente novamente.')
                clearTimeout(id)
            }, 500)
            return
        }

        this.nextLevel = this.level + 1 //;this.level = 7
        var winnerMessage = ' 🙂 VENCEDOR 🥳 \nVocê conseguiu impedir que o Coronavírus infectasse a Pessoa! Clique em "PRÓXIMO" e vá para o próximo nível.'
        var buttonMessage = 'PRÓXIMO'

        if (this.level == 7) {
            winnerMessage = ' 🏆 CAMPEÃO! 🤩 \nParabéns! Você avançou todos os níveis e evitou completamente o contágio pelo Cornavírus! Clique em "REINICIAR" e jogue novamente.'
            buttonMessage = 'REINICIAR'
            this.nextLevel = null
        }

        // WINNER
        this.view.setGameButtonTitle(buttonMessage)
        this.view.setGameButtonDisabled(false)
        var id = setTimeout(function(){
            window.alert(winnerMessage)
            clearTimeout(id)
        }, 500)
    }

    checkIfThereIsPathBetweenCoronavirusAndPerson() {
        if (!this.board.nodeWithCoronavirus.canReachPerson()) {
            window.alert('Você não pode isolar completamente a Pessoa ou o Coronavírus. \nRemova algum obstáculo para criar um caminho entre eles.\nDICA: Posicione os obstáculos mais próximos ao Coronavírus.')
            return false
        }
        return true
    }

}

GameViewController.personMessage = ' 👦 PESSOA 👩 \n\n' +
                                    ' ▪️ O triangulo amarelo representa a Pessoa. \n' + 
                                    ' ▪️ Sua posição é fixa. \n' + 
                                    ' ▪️ Seu objetivo é impedir que o Coronavírus chague até a Pessoa. \n' + 
                                    ' ▪️ Faça isso colocando obstáculos entre a Pessoa e o Coronavírus no tabuleiro. \n' + 
                                    ' ▪️ Adicione um obstáculo clicando em qualquer posição vazia do tabuleiro.'

GameViewController.shortCoronavirusMessage = ' 🦠 CORONAVÍRUS 🦠 \n\n' + 
                                                ' ▪️ O círculo verde representa o Coronavírus. \n' + 
                                                ' ▪️ Ele pode se mover para cima, para baixo, para esquerda e para a direita.'

GameViewController.coronavirusMessage = GameViewController.shortCoronavirusMessage + ' \n' + 
                                ' ▪️ Seu objetivo é impedir que o Coronavírus chague até a Pessoa. \n' + 
                                ' ▪️ Faça isso colocando obstáculos entre a Pessoa e o Coronavírus no tabuleiro. \n' + 
                                ' ▪️ Adicione um obstáculo clicando em qualquer posição vazia do tabuleiro.'

GameViewController.obstaclesMessage = ' 🚫 OBSTÁCULOS 🚫 \n\n' + 
                              ' ▪️ Os lonsagulos cinzas representam os obstáculos. \n' + 
                              ' ▪️ O Coronavírus não pode passar por um obstáculo. \n' +
                              ' ▪️ Posicione todos os obstáculos no tabueleiro e clique e "JOGAR". \n' + 
                              ' ▪️ Não é possível colocar obstáculos no tabuleiro enquanto o Coronavírus está se movendo.' 

