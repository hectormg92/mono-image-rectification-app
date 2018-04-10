import math from 'mathjs'

export default function leastSquares(arrayA, arrayK, arrayP) {
    const A = math.matrix(arrayA)

    if(!arrayP) {
        const aSize = A.size()
        const [cols, ] = aSize
        const size = [cols, cols]
        arrayP = math.eye(size)
    }

    const AT = math.transpose(A)
    const ATAinv = math.inv(math.multiply(math.multiply(AT, arrayP), A))
    const ATK = math.multiply(math.multiply(AT, arrayP), math.transpose(arrayK))
    // A.T * K *(A.T * A)-1
    return math.multiply(ATK, ATAinv)
}