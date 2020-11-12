var request = require('request');

describe('calc', () => {
    it('should multiply 10 by 9', () => {
        expect(10*9).toBe(90)
    });
    
    it('should multiply 11 by 9', () => {
        expect(11*9).toBeGreaterThan(97)
    });
});

describe('get messages', () => {
    it('should return 200 ok', (done) => {
        request.get('http://localhost:3070/messages', (err, res) => {
            expect(res.statusCode).toEqual(200)
            done()
        })
    })

    it('should return a list that is not empty', (done) => {
        request.get('http://localhost:3070/messages', (err, res) => {
            expect(JSON.parse(res.body).length).toBeGreaterThan(0)
            done()
        })
    })

    it('should confirm the list contains, id, name and message', (done) => {
        request.get('http://localhost:3070/messages', (err, res) => {
            expect(JSON.parse(res.body)[0]).toEqual({
                _id: "5fac08ea4aa332404c0b77a8",
                name: "Akinpelumi",
                message: "Hi over there",
                createdAt: "2020-11-11T15:53:14.739Z",
                __v: 0
            })
            done()
        })
    })
})

describe('get messages from a user', () => {
    it('should return 200 ok', (done) => {
        request.get('http://localhost:3070/messages/Akinpelumi', (err, res) => {
            expect(res.statusCode).toEqual(200)
            done()
        })
    })

    it('name should be Akinpelumi', (done) => {
        request.get('http://localhost:3070/messages/Akinpelumi', (err, res) => {
            expect(JSON.parse(res.body)[0].name).toEqual("Akinpelumi")
            done()
        })
    })
})