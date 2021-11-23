import * as THREE from "three";
import { BoxGeometry, MeshNormalMaterial } from "three";

export default class TicTacToeCube {
  constructor() {
    this.board = new THREE.Group();
    this.spheres = new THREE.Group();
    this.asterisks = new THREE.Group();
    this.boardLines = new THREE.Group();
    this.hiddenCubes = new THREE.Group();
    this.winStrikes = new THREE.Group();

    this.board.add(this.spheres);
    this.board.add(this.asterisks);
    this.board.add(this.boardLines);
    this.board.add(this.hiddenCubes);
    this.board.add(this.winStrikes);

    this.currentPlayer = "sphere";
    this.boardCopy = [
      [
        // z = 24
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
      ],
      [
        // z = 0
        ["10", "11", "12"],
        ["13", "14", "15"],
        ["16", "17", "18"],
      ],
      [
        // z = -24
        ["19", "20", "21"],
        ["22", "23", "24"],
        ["25", "26", "27"],
      ],
    ];

    this._createBoard();
  }

  checkWinConditions() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this._checkXRow(i, j)) {
          const strike = this._getHorizontalStrike({
            x: 0,
            y: this._getYOffset(j),
            z: this._getZOffset(i),
          });
          this.winStrikes.add(strike);
        }
        if (this._checkZRow(i, j)) {
          const strike = this._getZStrike({
            x: this._getXOffset(i),
            y: this._getYOffset(j),
            z: 0,
          });
          this.winStrikes.add(strike);
        }
        if (this._checkCol(i, j)) {
          const strike = this._getVerticalStrike({
            x: this._getXOffset(j),
            y: 0,
            z: this._getZOffset(i),
          });
          this.winStrikes.add(strike);
        }
      }
    }
  }

  _getVerticalStrike(offset) {
    const strikeGeometry = new THREE.BoxGeometry(2, 64, 2);
    const strikeMaterial = new THREE.MeshNormalMaterial();
    const strike = new THREE.Mesh(strikeGeometry, strikeMaterial);
    strike.position.x = offset.x;
    strike.position.y = offset.y;
    strike.position.z = offset.z;
    return strike;
  }

  _getZStrike(offset) {
    const strikeGeometry = new THREE.BoxGeometry(2, 2, 64);
    const strikeMaterial = new THREE.MeshNormalMaterial();
    const strike = new THREE.Mesh(strikeGeometry, strikeMaterial);
    strike.position.x = offset.x;
    strike.position.y = offset.y;
    strike.position.z = offset.z;
    return strike;
  }

  _getHorizontalStrike(offset) {
    const strikeGeometry = new THREE.BoxGeometry(64, 2, 2);
    const strikeMaterial = new THREE.MeshNormalMaterial();
    const strike = new THREE.Mesh(strikeGeometry, strikeMaterial);
    strike.position.x = offset.x;
    strike.position.y = offset.y;
    strike.position.z = offset.z;
    return strike;
  }

  _checkXRow(i, j) {
    return (
      this.boardCopy[i][j][0] === this.boardCopy[i][j][1] &&
      this.boardCopy[i][j][1] === this.boardCopy[i][j][2]
    );
  }

  _checkZRow(i, j) {
    return (
      this.boardCopy[0][j][i] === this.boardCopy[1][j][i] &&
      this.boardCopy[1][j][i] === this.boardCopy[2][j][i]
    );
  }

  _checkCol(i, j) {
    return (
      this.boardCopy[i][0][j] === this.boardCopy[i][1][j] &&
      this.boardCopy[i][1][j] === this.boardCopy[i][2][j]
    );
  }

  _createBoard() {
    // add vertical lines
    const verticalDimensions = { x: 4, y: 64, z: 4 };
    const verticalLeftFront = { x: -12, y: 0, z: 12 };
    const verticalLeftBack = { x: -12, y: 0, z: -12 };
    const verticalRightFront = { x: 12, y: 0, z: 12 };
    const verticalRightBack = { x: 12, y: 0, z: -12 };
    const verticalLineOffsets = [
      verticalLeftFront,
      verticalLeftBack,
      verticalRightFront,
      verticalRightBack,
    ];
    verticalLineOffsets.forEach((verticalLineOffset) => {
      const verticalBoardLine = this._boardLine({
        dimensions: verticalDimensions,
        offsets: verticalLineOffset,
      });
      this.boardLines.add(verticalBoardLine);
    });

    // add horizontal lines
    const horizontalDimensions = { x: 64, y: 4, z: 4 };
    const horizontalTopFront = { x: 0, y: 12, z: 12 };
    const horizontalTopBack = { x: 0, y: 12, z: -12 };
    const horizontalBottomFront = { x: 0, y: -12, z: 12 };
    const horizontalBottomBack = { x: 0, y: -12, z: -12 };
    const horizontalLineOffsets = [
      horizontalTopFront,
      horizontalTopBack,
      horizontalBottomFront,
      horizontalBottomBack,
    ];
    horizontalLineOffsets.forEach((horizontalLineOffset) => {
      const horizontalBoardLine = this._boardLine({
        dimensions: horizontalDimensions,
        offsets: horizontalLineOffset,
      });
      this.boardLines.add(horizontalBoardLine);
    });

    // add z-axis lines
    const zAxisDimensions = { x: 4, y: 4, z: 64 };
    const zAxisTopLeft = { x: -12, y: 12, z: 0 };
    const zAxisTopRight = { x: 12, y: 12, z: 0 };
    const zAxisBottomLeft = { x: -12, y: -12, z: 0 };
    const zAxisBottomRight = { x: 12, y: -12, z: 0 };
    const zAxisLineOffsets = [
      zAxisTopLeft,
      zAxisTopRight,
      zAxisBottomLeft,
      zAxisBottomRight,
    ];
    zAxisLineOffsets.forEach((zAxisLineOffset) => {
      const zAxisBoardLine = this._boardLine({
        dimensions: zAxisDimensions,
        offsets: zAxisLineOffset,
      });
      this.boardLines.add(zAxisBoardLine);
    });

    // add hidden cubes
    const topBackLeft = { x: -24, y: 24, z: -24 };
    const topBackMiddle = { x: 0, y: 24, z: -24 };
    const topBackRight = { x: 24, y: 24, z: -24 };
    const topMiddleLeft = { x: -24, y: 24, z: 0 };
    const topMiddleMiddle = { x: 0, y: 24, z: 0 };
    const topMiddleRight = { x: 24, y: 24, z: 0 };
    const topFrontLeft = { x: -24, y: 24, z: 24 };
    const topFrontMiddle = { x: 0, y: 24, z: 24 };
    const topFrontRight = { x: 24, y: 24, z: 24 };

    const middleBackLeft = { x: -24, y: 0, z: -24 };
    const middleBackMiddle = { x: 0, y: 0, z: -24 };
    const middleBackRight = { x: 24, y: 0, z: -24 };
    const middleMiddleLeft = { x: -24, y: 0, z: 0 };
    const middleMiddleMiddle = { x: 0, y: 0, z: 0 };
    const middleMiddleRight = { x: 24, y: 0, z: 0 };
    const middleFrontLeft = { x: -24, y: 0, z: 24 };
    const middleFrontMiddle = { x: 0, y: 0, z: 24 };
    const middleFrontRight = { x: 24, y: 0, z: 24 };

    const bottomBackLeft = { x: -24, y: -24, z: -24 };
    const bottomBackMiddle = { x: 0, y: -24, z: -24 };
    const bottomBackRight = { x: 24, y: -24, z: -24 };
    const bottomMiddleLeft = { x: -24, y: -24, z: 0 };
    const bottomMiddleMiddle = { x: 0, y: -24, z: 0 };
    const bottomMiddleRight = { x: 24, y: -24, z: 0 };
    const bottomFrontLeft = { x: -24, y: -24, z: 24 };
    const bottomFrontMiddle = { x: 0, y: -24, z: 24 };
    const bottomFrontRight = { x: 24, y: -24, z: 24 };

    const hiddenCubeOffsets = [
      topBackLeft,
      topBackMiddle,
      topBackRight,
      topMiddleLeft,
      topMiddleMiddle,
      topMiddleRight,
      topFrontLeft,
      topFrontMiddle,
      topFrontRight,

      middleBackLeft,
      middleBackMiddle,
      middleBackRight,
      middleMiddleLeft,
      middleMiddleMiddle,
      middleMiddleRight,
      middleFrontLeft,
      middleFrontMiddle,
      middleFrontRight,

      bottomBackLeft,
      bottomBackMiddle,
      bottomBackRight,
      bottomMiddleLeft,
      bottomMiddleMiddle,
      bottomMiddleRight,
      bottomFrontLeft,
      bottomFrontMiddle,
      bottomFrontRight,
    ];
    hiddenCubeOffsets.forEach((hiddenCubeOffset) => {
      const hiddenCube = this._hiddenCube({
        offsets: hiddenCubeOffset,
      });
      this.hiddenCubes.add(hiddenCube);
    });
  }

  _boardLine({ dimensions, offsets }) {
    const boardLineGeometry = new THREE.BoxGeometry(
      dimensions.x,
      dimensions.y,
      dimensions.z
    );
    const boardLineMaterial = new THREE.MeshNormalMaterial();
    const boardLine = new THREE.Mesh(boardLineGeometry, boardLineMaterial);
    boardLine.position.x = offsets.x;
    boardLine.position.y = offsets.y;
    boardLine.position.z = offsets.z;
    return boardLine;
  }

  _hiddenCube({ offsets }) {
    const cubeGeometry = new THREE.BoxGeometry(12, 12, 12);
    // const cubeMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: "black" });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = offsets.x;
    cube.position.y = offsets.y;
    cube.position.z = offsets.z;
    return cube;
  }

  _getX(x) {
    if (x === -24) {
      return 0;
    } else if (x === 0) {
      return 1;
    } else {
      return 2;
    }
  }

  _getXOffset(x) {
    if (x === 0) {
      return -24;
    } else if (x === 1) {
      return 0;
    } else {
      return 24;
    }
  }

  _getY(y) {
    if (y === 24) {
      return 0;
    } else if (y === 0) {
      return 1;
    } else {
      return 2;
    }
  }

  _getYOffset(y) {
    if (y === 0) {
      return 24;
    } else if (y === 1) {
      return 0;
    } else {
      return -24;
    }
  }

  _getZ(z) {
    if (z === 24) {
      return 0;
    } else if (z === 0) {
      return 1;
    } else {
      return 2;
    }
  }

  _getZOffset(z) {
    if (z === 0) {
      return 24;
    } else if (z === 1) {
      return 0;
    } else {
      return -24;
    }
  }

  _updateBoardCopy(offset, move) {
    const x = this._getX(offset.x);
    const y = this._getY(offset.y);
    const z = this._getZ(offset.z);

    this.boardCopy[z][y][x] = move;
  }

  addSphereOrAsterisk(offset) {
    if (this.currentPlayer === "sphere") {
      this._updateBoardCopy(offset, "o");
      const sphere = this._sphere(offset);
      this.spheres.add(sphere);
      this.currentPlayer = "asterisk";
    } else if (this.currentPlayer === "asterisk") {
      this._updateBoardCopy(offset, "x");
      const asterisk = this._asterisk(offset);
      this.asterisks.add(asterisk);
      this.currentPlayer = "sphere";
    }
  }

  _sphere(offset) {
    const sphereGeometry = new THREE.SphereGeometry(7);
    const sphereMaterial = new THREE.MeshNormalMaterial();
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = offset.x;
    sphere.position.y = offset.y;
    sphere.position.z = offset.z;
    return sphere;
  }

  _asterisk(offset) {
    const asteriskGroup = new THREE.Group();
    const asteriskGeometry = new THREE.BoxGeometry(4, 15, 4);
    const asteriskMaterial = new THREE.MeshNormalMaterial();
    const a1 = new THREE.Mesh(asteriskGeometry, asteriskMaterial);
    const a2 = new THREE.Mesh(asteriskGeometry, asteriskMaterial);
    const a3 = new THREE.Mesh(asteriskGeometry, asteriskMaterial);
    const a4 = new THREE.Mesh(asteriskGeometry, asteriskMaterial);
    const a5 = new THREE.Mesh(asteriskGeometry, asteriskMaterial);
    a2.rotation.z = Math.PI / 3;
    a2.rotation.y = Math.PI / 4;
    a3.rotation.z = -Math.PI / 3;
    a3.rotation.y = -Math.PI / 4;
    a4.rotation.z = -Math.PI / 3;
    a4.rotation.y = Math.PI / 4;
    a5.rotation.z = Math.PI / 3;
    a5.rotation.y = -Math.PI / 4;
    asteriskGroup.add(a1, a2, a3, a4, a5);
    asteriskGroup.position.x = offset.x;
    asteriskGroup.position.y = offset.y;
    asteriskGroup.position.z = offset.z;
    return asteriskGroup;
  }
}
