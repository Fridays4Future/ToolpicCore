class GalleryMatrix {
  constructor(n, ratio, wishRatio, asymmetricFlag = true, preferedDrawDirectionFlag = 0) {
    this.wishRatio = wishRatio;
    this.preferedDrawDirection = preferedDrawDirectionFlag;
    this.asymmetricFlag = asymmetricFlag;


    const matrix = this.getMatrix(n, ratio);

    const allMatrixes = GalleryMatrix.destructMatrixes(matrix);

    const realMatrix = new Array().concat(...allMatrixes.map(GalleryMatrix.realizeMatrix));

    const coordinateMatrix = GalleryMatrix.createCoordinateMatrix(realMatrix);

    return coordinateMatrix;
  }
  getMatrix(n, ratio) {

    const matrix = this.getSymmetricMatrix(n, ratio);
    const allRatiosSymmetric = GalleryMatrix.getMatrixRatioArray(matrix);

    // If prime number
    const isRow = Object.values(matrix).includes(1);
    // If we have more than 2 items, try out splitted matrixes
    if (n > 2) {
      if (this.asymmetricFlag) {
        const matrixes = this.splitMatrix(n, ratio);

        const matrixesDestructured = GalleryMatrix.destructMatrixes(matrixes);

        //const allRatios = matrixes.reduce((accumulator, matrix) => accumulator.concat(getMatrixRatioArray(matrix)), new Array);
        const allRatiosSplitted = new Array().concat(...matrixesDestructured.map(GalleryMatrix.getMatrixRatioArray));

        const averageRatioSymmetric = GalleryMatrix.getAverageRatio(allRatiosSymmetric);
        const averageRatioSplitted = GalleryMatrix.getAverageRatio(allRatiosSplitted);

        if (GalleryMatrix.ratioIsCloser(averageRatioSplitted, averageRatioSymmetric, this.wishRatio, this.preferedDrawDirection)) {
          return matrixes;
        }
      }

    }

    return [matrix];
  }
  splitMatrix(n, ratio) {
    // Create asymmetric solution
    // by dividing it into two matrixes
    const matrixesCount = [
      Math.ceil(n / 2),
      Math.trunc(n / 2)
    ];
    const matrixes = matrixesCount.map(count => {
      return this.getMatrix(count, ratio / 2);
    });
    return matrixes;
  }
  getSymmetricMatrix(n, ratio, direction = "x") {
    const divisors = GalleryMatrix.getDivisors(n);

    let bestDivisors = null;

    for (const divisor of divisors) {
      const [ x, y ] = [divisor, n / divisor];

      // Ratio is exactly the height measured using the width as instrument
      // Potential ratio for the elements within
      let potentialRatio = (ratio / y) / (1 / x);

      if (!bestDivisors) {
        bestDivisors = {
          ratio: potentialRatio,
          x,
          y
        }
      }


      if (GalleryMatrix.ratioIsCloser(potentialRatio, bestDivisors.ratio, this.wishRatio, this.preferedDrawDirection)) {
        bestDivisors = {
          ratio: potentialRatio,
          x,
          y
        }
      }

    }

    return {
      ratio: bestDivisors.ratio,
      x: bestDivisors.x,
      y: bestDivisors.y
    }
  }
  static getAverageRatio(ratios) {
    return ratios.reduce((accumulator, value) => accumulator + value, 0) / ratios.length;
  }
  static getMatrixRatioArray(matrix) {
    return Array(Math.max(matrix.x, matrix.y)).fill(matrix.ratio);
  }
  static realizeMatrix(matrix) {
    return new Array(matrix.y).fill(matrix.x);
  }
  static destructMatrixes(matrixes) {
    const allMatrixes = [];
    function loop(arr) {
      for (let item of arr) {
        if (item instanceof Array) {
          loop(item);
        }
        else {
          allMatrixes.push(item);
        }
      }
    }
    loop(matrixes);
    return allMatrixes;
  }
  static createCoordinateMatrix(realMatrix) {
    return new Array().concat(...realMatrix.map((count, rowIndex) => {
      const row = [];
      const width = 1 / count;
      const height = 1 / realMatrix.length;
      for (var i = 0; i < count; i++) {
        const pos = {
          width,
          height,
          x: i * width,
          y: rowIndex * height,
        }
        row.push(pos);
      }
      return row;
    })).map((item, index) => {
      item.__index = index;
      return item;
    });
  }
  static ratioIsCloser(ratio, compareRatio, wishRatio, preferedDrawDirection) {
    const ratioDiff = ratio - wishRatio;
    const oldRatioDiff = compareRatio - wishRatio;

    /// Wether the ratio differences are compareable (both + or -)
    const ratioDiffsCompareable = ratioDiff / Math.abs(ratioDiff) === oldRatioDiff / Math.abs(oldRatioDiff);

    // Turn the old ratio if they are not comperable, so now the differences are comperable
    const oldRatioCompareable = ratioDiffsCompareable ? compareRatio : (1 / compareRatio);
    // Get new difference
    const oldRatioDiffCompareable = oldRatioCompareable - wishRatio;

    if (preferedDrawDirection === 0) {
      return Math.abs(ratioDiff) < Math.abs(oldRatioDiffCompareable);
    }
    else {
      return Math.abs(ratioDiff) <= Math.abs(oldRatioDiffCompareable);
    }

  }
  static getDivisors(n) {
    const divisors = [n];
    for (let i = Math.trunc(n / 2); i > 0; i--) {
      if ((n / i) % 1 == 0) {
        divisors.push(i);
      }
    }
    //return new Array(Math.trunc(n / 2)).fill(true).map((val, i) => i + 1).filter(val => (n / val) % 1 == 0).concat(n);
    return divisors;
  }
}

export default GalleryMatrix;
