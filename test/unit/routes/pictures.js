'use strict'

var chai = require('chai')
var expect = chai.expect
var sinon = require('sinon')
var proxyquire = require('proxyquire')

var instagramClient = {
  request: sinon.stub()
}

chai.use(require('sinon-chai'))

var pictures = proxyquire(process.cwd() + '/lib/routes/pictures', {
  '../instagramClient': instagramClient
})

describe('pictures route module', function () {
  it('has byLocation() function', function () {
    expect(pictures.byLocation).to.be.a('function')
  })
  it('has byId() function', function () {
    expect(pictures.byId).to.be.a('function')
  })
})

describe('pictures.byLocation', function () {
  var  req, res, next
  beforeEach(function () {
    req = {
      query: {
        lat: 1.234,
        lng: 9.876,
        dst: 1337
      }
    }
    res = {
      end: sinon.stub(),
      send: sinon.stub(),
      setHeader: sinon.stub()
    }
    next = sinon.stub()
  })
  it('should return queryParametersMissing if req.query missing', function () {
    req.query = null
    pictures.byLocation(req, res, next)
    sinon.spy()
    expect(res.end).calledOnce.calledWith('queryParametersMissing')
  })
  it('should call res.setHeader() to set json Content-Type', function () {
    pictures.byLocation(req, res, next)
    sinon.spy()
    expect(res.setHeader).calledOnce.calledWith('Content-Type', 'application/json')
  })
  it('should call Instagram API with proper parameters', function () {
    pictures.byLocation(req, res, next)
    sinon.spy()
    expect(instagramClient.request).calledWith('https://api.instagram.com/v1/media/search?client_id=99ae0c29782c49c7af438178b4e81cfb&lat=1.234&lng=9.876&distance=1337')
  })
})

describe('pictures.byId', function () {
  var  req, res, next
  beforeEach(function () {
    req = {
      params: {
        id: 1911
      }
    }
    res = {
      end: sinon.stub(),
      send: sinon.stub(),
      setHeader: sinon.stub()
    }
    next = sinon.stub()
  })
  it('should return queryParametersMissing if req.params missing', function () {
    req.params = null
    pictures.byId(req, res, next)
    sinon.spy()
    expect(res.end).calledOnce.calledWith('queryParametersMissing')
  })
  it('should call res.setHeader() to set json Content-Type', function () {
    pictures.byId(req, res, next)
    sinon.spy()
    expect(res.setHeader).calledOnce.calledWith('Content-Type', 'application/json')
  })
  it('should call Instagram API with proper parameters', function () {
    pictures.byLocation(req, res, next)
    sinon.spy()
    expect(instagramClient.request).calledWith('https://api.instagram.com/v1/media/1911?client_id=99ae0c29782c49c7af438178b4e81cfb')
  })
})
