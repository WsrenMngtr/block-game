var objectFact = function (master, imgSrc, x, y) {
    var o = {
        master: master,
        img: new Image,
        x: x,
        y: y,
        moveTo: function (x, y) {
            o.x = x
            o.y = y
            o.master.context.drawImage(o.img, x, y)
        },
        reDraw: function () {
            o.moveTo(o.x, o.y)
        },
    }
    o.img.src = imgSrc
    window.onload = function () {
        o.master.context.drawImage(o.img, o.x, o.y)
    }
    o.reDraw()
    return o
}

var addBox = function (o, args) {
    o.xStep = args['xStep']
    o.down = 'none'
    o.moveLeft = function () {
        o.moveTo(o.x - o.xStep, o.y)
    }
    o.moveRight = function () {
        o.moveTo(o.x + o.xStep, o.y)
    }
    o.move = function () {
        if (o.down === 'left') {
            o.moveLeft()
        } else if (o.down === 'right') {
            o.moveRight()
        } else {
            o.reDraw()
        }
        o.down = 'none'
    }
    o.beImpacted = function (ball) {
        var ballWidth = ball.img.width
        var objectWidth = o.img.width
        var objectHeight = o.img.height
        if (o.x <= ball.x + ballWidth/2 && ball.x + ballWidth/2 <= o.x + objectWidth) {
            if (o.y <= ball.y && ball.y <= o.y + objectHeight) {
                ball.yStep *= -1
            }
        }
    }
    window.addEventListener ('keydown', function (event) {
        var k = event.key
        if (k === 'a') {
            o.down = 'left'
        } else if (k === 'd') {
            o.down = 'right'
        }
    })
    return o
}

var addBall = function (o, args) {
    o.beginned = false
    o.xStep = 0
    o.yStep = 0
    o.impactedList = args['impactedList']
    o.impact = function (object) {
        object.beImpacted(o)
    }
    o.move = function () {
        o.impact(o.impactedList[0])
        o.impact(o.impactedList[1])
        o.impactedList[2].forEach(element => {
            o.impact(element)
        })
        o.moveTo(o.x + o.xStep, o.y + o.yStep)
    }
    o.moveBeg = function (x, y) {
        o.xStep = x
        o.yStep = y
    }
    window.addEventListener('keydown', function (event) {
        if (!o.beginned && event.key === ' ') {
            o.moveBeg(args.step, args.step)
            o.beginned = true
        }
    })
    return o
}

var addBlock = function (o, args) {
    o.isImpacted = false
    o.move = function () {
        if (!o.isImpacted) {
            o.reDraw()
        }
    }
    o.beImpacted = function (ball) {
        var ballWidth = ball.img.width
        var ballHeight = ball.img.height
        var objectWidth = o.img.width
        var objectHeight = o.img.height
        if (!o.isImpacted) {
            if (o.y <= ball.y + ballHeight/2 && ball.y + ballHeight/2 <= o.y + objectHeight) {
                if (o.x <= ball.x + ballWidth && ball.x + ballWidth <= o.x + ballWidth
                || o.x + objectWidth <= ball.x && ball.x <= o.x + objectWidth + ballWidth) {
                    ball.xStep *= -1
                    o.isImpacted = true
                }
            }
            var ballMiddleX = ball.x + ballWidth/2
            if (o.x <= ballMiddleX && ballMiddleX <= o.x + objectWidth) {
                if (o.y + objectHeight - ballHeight <= ball.y && ball.y <= o.y + objectHeight
                || o.y <= ball.y + ballHeight && ball.y + ballHeight <= o.y + ballHeight) {
                    ball.yStep *= -1
                    o.isImpacted = true
                }
            }
        }
    }
}

var getObject = function (o, type, args) {
    if (type === 'box') {
        addBox(o, args)
    } else if (type === 'ball') {
        addBall(o, args)
    } else if (type === 'block') {
        addBlock(o, args)
    }
    return o
}
