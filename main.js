var levelWord = '[\
    [{"x":0,"y":400},{"x":100,"y":500},{"x":200,"y":400},{"x":300,"y":400},{"x":400,"y":500}],\
    [{"x":0,"y":400},{"x":200,"y":500},{"x":400,"y":400},{"x":600,"y":400},{"x":400,"y":500}],\
    [\
        {"x":0,"y":400},{"x":0,"y":500},{"x":100,"y":400},{"x":100,"y":500},{"x":200,"y":400},{"x":200,"y":500},\
        {"x":300,"y":400},{"x":300,"y":500},{"x":400,"y":400},{"x":400,"y":500}\
    ]\
]'
var log = console.log.bind(console)

var makeGame = function () {
    var canvas = document.querySelector('#id-canvas')
    var context = canvas.getContext('2d')
    var score = document.querySelector('#id-score')
    var level = JSON.parse(levelWord)
    var o = {
        canvas: canvas,
        context: context,
        levelList: level,
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        clear: function () {
            context.clearRect(0, 0, canvas.width, canvas.height)
        },
    }
    o.score = score
    o.level = score.textContent
    o.beImpacted = function (ball) {
        var width = ball.img.width
        var height = ball.img.height
        if (ball.x <= o.x || ball.x + width >= o.x + o.width) {
            ball.xStep *= -1
        } 
        if (ball.y + height >= o.y + o.height) {
            ball.yStep *= -1
        }
    }
    o.nextLevel = function () {
        if (o.level + 1 == o.levelList.length) {
            alert('game over')
        } else {
            o.level++
            o.score.textContent = o.level
        }
    }
    setInterval(function () {
        o.updata()
    }, 1000 / 30)
    return o
}

var __main = function () {
    game = makeGame()
    var box = getObject(objectFact(game, 'box.jpg', 300, 0), 'box', {xStep: 15,})
    var blocks = []
    game.levelList[game.level].forEach(element => {
        blocks.push(getObject(objectFact(game, "block.gif", element.x, element.y), 'block', {}))
    })
    var ball = getObject(objectFact(game, 'ball.gif', 100, 100), 'ball', {step: 15, impactedList: [game, box, blocks,],})
    game.updata = function () {
        game.clear()
        box.move()
        ball.move()
        blocks.forEach(element => {
            element.move()
        })
        if (blocks.every(function (element) { return element.isImpacted })) {
            game.nextLevel()
            blocks = []
            game.levelList[game.level].forEach(element => {
                blocks.push(getObject(objectFact(game, "block.gif", element.x, element.y), 'block', {}))
            })
            ball.impactedList.pop()
            ball.impactedList.push(blocks)
        }
    }       
}

__main()
