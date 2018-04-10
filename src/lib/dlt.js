import math from 'mathjs'

import LeastSquares from './utils/least-squares'

export default () => {}

export function dlt(points2d, points3d) {
    const pointsZipped = zip(points2d, points3d)

    const arrayA = []
        , arrayK = []

    for(const [[x, y], [X, Y, Z]] of pointsZipped) {
        // x + rx = X*a1 + Y*b1 + Z*c1 + d1 - x*X*a3 - x*Y*b3 -x*Z*c3
        const a1 = [X, Y, Z, 1, 0, 0, 0, 0, -x*X, -x*Y, -x*Z]
        // y + ry = X*a2 + Y*b2 + Z*c2 + d2 - y*X*a3 - y*Y*b3 -y*Z*c3
        const a2 = [0, 0, 0, 0, X, Y, Z, 1, -y*X, -y*Y, -y*Z]

        arrayA.push(a1, a2)
        arrayK.push(x, y)
    }

    return LeastSquares(arrayA, arrayK)
}

export function dltAdditionalParameters(points2d, points3d) {
    const pointsZipped = zip(points2d, points3d)

    const arrayA = []
        , arrayK = []

    for(const [[x, y], [X, Y, Z]] of pointsZipped) {
        // x + rx = X*a1 + Y*b1 + Z*c1 + d1 - x*X*a3 - x*Y*b3 -x*Z*c3 - Ax
        // y + ry = X*a2 + Y*b2 + Z*c2 + d2 - y*X*a3 - y*Y*b3 -y*Z*c3 - Ay

        // donde Ax = x(K1(r**2 - r0**2) + K2(r**4 - r0**4) + K2(r**6 - r0**6)) + (2P1x'x')*(1 + P3 por r**2)

        //rraya = x - xo   r = sqrt(xraya^2 + yraya^2) ro = sqrt(xo^2 + yo^2)

        const a1 = [X, Y, Z, 1, 0, 0, 0, 0, -x*X, -x*Y, -x*Z]
        const a2 = [0, 0, 0, 0, X, Y, Z, 1, -y*X, -y*Y, -y*Z]

        arrayA.push(a1, a2)
        arrayK.push(x, y)
    }

    const A = math.matrix(arrayA)
    const AT = math.transpose(A)
    const ATAinv = math.inv(math.multiply(AT, A))
    const ATK = math.multiply(AT, math.transpose(arrayK))
    // A.T * K *(A.T * A)-1
    return math.multiply(ATK, ATAinv)
}

export function getInternalOrientationParameters(DLTParams) {
    // DLTParams = [a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3]
    //             [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10]
    const [a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3] = DLTParams
    const vec_a1 = [a1, b1, c1]
    const vec_a2 = [a2, b2, c2]
    const vec_a3 = [a3, b3, c3]

    const a1ta1 = math.multiply(math.transpose(vec_a1), vec_a1)
    const a1ta2 = math.multiply(math.transpose(vec_a1), vec_a2)
    const a1ta3 = math.multiply(math.transpose(vec_a1), vec_a3)
    const a2ta3 = math.multiply(math.transpose(vec_a2), vec_a3)
    const a3ta3 = math.multiply(math.transpose(vec_a3), vec_a3)

    const p = math.sqrt(a3ta3)

    const xo = math.divide(a1ta3, a3ta3)
    const yo = math.divide(a2ta3, a3ta3)

    const f2 = math.divide(a1ta1, a3ta3) - (xo**2)

    const f = math.sqrt(f2)

    const h = -1 *  math.divide(
        math.det(math.matrix([vec_a1, vec_a2, vec_a3])),
        p**3 * f2
    )

    const s1 = math.multiply(a1ta2, a3ta3)
    const s2 = math.multiply(a1ta3, a2ta3)

    const div1 = math.multiply(a1ta1, a3ta3)
    const div2 = a1ta3

    const d = math.divide(s1 - s2, div1 - div2)

    return {
        xo, yo, f, h, d
    }

}

export function getExternalOrientationParameters(DLTParams) {

    const paramsIO = getInternalOrientationParameters(DLTParams)
    const { xo, yo, f, h, d } = paramsIO

    const [a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3] = DLTParams

    const vec_a1 = [a1, b1, c1]
    const vec_a2 = [a2, b2, c2]
    const vec_a3 = [a3, b3, c3]

    const vecsMatrix = math.matrix([vec_a1, vec_a2, vec_a3])
    const vec_d = math.transpose([-d1, -d2, -1])

    const X = math.multiply(math.inv(vecsMatrix), vec_d)

    const mm = [
        [ h, 0,       -h*xo],
        [-d, 1, (xo*d) - yo],
        [ 0, 0,        -h*f]
    ]

    const a3ta3 = math.multiply(math.transpose(vec_a3), vec_a3)
    const p = math.sqrt(a3ta3)

    const ct = math.divide(1, p*h*f)

    const M = math.multiply(ct, math.multiply(mm, vecsMatrix))

    const R = math.inv(M)
    // console.log(R, R.valueOf())
    const r21 = R.valueOf()[1][0]
    const r31 = R.valueOf()[2][0]
    const r32 = R.valueOf()[2][1]
    
    const phi = -math.sinh(r31)
    const omega = math.sinh(r32 * math.cos(phi))
    const kappa = math.sinh(r21 * math.cos(phi))

    const [omegadeg, phideg, kappadeg] = [omega, phi, kappa].map(n => math.divide(math.multiply(n, 200), math.pi))


    return {
        X, M, R, omega, phi, kappa, omegadeg, phideg, kappadeg
    }

}

function zip(a, b) {
    return a.map((a1, i) => [a1, b[i]])
}


/**
 * TEST
*/

const points2d = [
    [-33.501, -43.864],
    [ 44.120, -46.617],
    [-29.510,  28.970],
    [ 41.083,  29.201],
    [  3.238,  -5.642],
    [-13.838, -21.982],
    [ 19.838,  10.810]
]

const points3d = [
    [10, 10, 15],
    [15, 10, 15],
    [10, 15, 15],
    [15, 15, 15],
    [12.45, 12.5, 12.5],
    [10, 10, 10],
    [15, 15, 10]
]

const solDLT = dlt(points2d, points3d)

console.log(solDLT)

const paramsIO = getInternalOrientationParameters(solDLT.valueOf())
const paramsEO = getExternalOrientationParameters(solDLT.valueOf())

console.log(paramsIO)
console.log(paramsEO)