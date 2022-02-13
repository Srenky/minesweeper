import { Cell, CellState, CellValue } from '../types/types'
import { MAX_HEIGHT, MAX_WIDTH, N_OF_MINES } from '../constants/constants';

const grabAllAdjacentCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): {
    topLeftCell: Cell | null;
    topCell: Cell | null;
    topRightCell: Cell | null;
    leftCell: Cell | null;
    rightCell: Cell | null;
    bottomLeftCell: Cell | null;
    bottomCell: Cell | null;
    bottomRightCell: Cell | null;
  } => {
    const topLeftCell =
      rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
    const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
    const topRightCell =
      rowParam > 0 && colParam < MAX_WIDTH - 1
        ? cells[rowParam - 1][colParam + 1]
        : null;
    const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
    const rightCell =
      colParam < MAX_WIDTH - 1 ? cells[rowParam][colParam + 1] : null;
    const bottomLeftCell =
      rowParam < MAX_HEIGHT - 1 && colParam > 0
        ? cells[rowParam + 1][colParam - 1]
        : null;
    const bottomCell =
      rowParam < MAX_HEIGHT - 1 ? cells[rowParam + 1][colParam] : null;
    const bottomRightCell =
      rowParam < MAX_HEIGHT - 1 && colParam < MAX_WIDTH - 1
        ? cells[rowParam + 1][colParam + 1]
        : null;

    return {
      topLeftCell,
      topCell,
      topRightCell,
      leftCell,
      rightCell,
      bottomLeftCell,
      bottomCell,
      bottomRightCell
    };
};

export const generateCells = (): Cell[][] => {
    let cells: Cell[][] = [];

    // generating empty board
    for (let row = 0; row < MAX_HEIGHT; row++) {
        cells.push([]);
        for (let col = 0; col < MAX_WIDTH; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.open
            })
        }
    }

    // adding mines
    let bombsPlaced = 0;
    while (bombsPlaced < N_OF_MINES) {
      const randomRow = Math.floor(Math.random() * MAX_HEIGHT);
      const randomCol = Math.floor(Math.random() * MAX_WIDTH);
  
      const currentCell = cells[randomRow][randomCol];
      if (currentCell.value !== CellValue.bomb) {
        cells = cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (randomRow === rowIndex && randomCol === colIndex) {
              return {
                ...cell,
                value: CellValue.bomb
              };
            }
  
            return cell;
          })
        );
        bombsPlaced++;
      }
    }

    // adding numbers to cells
    for (let rowIndex = 0; rowIndex < MAX_HEIGHT; rowIndex++) {
      for (let colIndex = 0; colIndex < MAX_WIDTH; colIndex++) {
        const currentCell = cells[rowIndex][colIndex];
        if (currentCell.value === CellValue.bomb) {
          continue;
        }
  
        let numberOfBombs = 0;
        const {
          topLeftCell,
          topCell,
          topRightCell,
          leftCell,
          rightCell,
          bottomLeftCell,
          bottomCell,
          bottomRightCell
        } = grabAllAdjacentCells(cells, rowIndex, colIndex);
  
        if (topLeftCell?.value === CellValue.bomb) {
          numberOfBombs++;
        }
        if (topCell?.value === CellValue.bomb) {
          numberOfBombs++;
        }
        if (topRightCell?.value === CellValue.bomb) {
          numberOfBombs++;
        }
        if (leftCell?.value === CellValue.bomb) {
          numberOfBombs++;
        }
        if (rightCell?.value === CellValue.bomb) {
          numberOfBombs++;
        }
        if (bottomLeftCell?.value === CellValue.bomb) {
          numberOfBombs++;
        }
        if (bottomCell?.value === CellValue.bomb) {
          numberOfBombs++;
        }
        if (bottomRightCell?.value === CellValue.bomb) {
          numberOfBombs++;
        }
  
        if (numberOfBombs > 0) {
          cells[rowIndex][colIndex] = {
            ...currentCell,
            value: numberOfBombs
          };
        }
      }
    }

    return cells
}

export const openAdjacentCells = (
  cells: Cell[][],
  row: number,
  col: number
): Cell[][] => {
    if (cells[row][col].state === CellState.flagged ||
        cells[row][col].state === CellState.visible) {
      return cells;
    }

    let newCells = cells.slice();
    newCells[row][col].state = CellState.visible;

    const {
      topLeftCell,
      topCell,
      topRightCell,
      leftCell,
      rightCell,
      bottomLeftCell,
      bottomCell,
      bottomRightCell
    } = grabAllAdjacentCells(newCells, row, col);

    if (topLeftCell?.state === CellState.open && topLeftCell.value !== CellValue.bomb) {
      if (topLeftCell.value === CellValue.none) {
        newCells = openAdjacentCells(newCells, row - 1, col - 1);
      } else {
        newCells[row - 1][col - 1].state = CellState.visible;
      }
    }

    if (topCell?.state === CellState.open && topCell.value !== CellValue.bomb) {
      if (topCell.value === CellValue.none) {
        newCells = openAdjacentCells(newCells, row - 1, col);
      } else {
        newCells[row - 1][col].state = CellState.visible;
      }
    }
    
    if (topRightCell?.state === CellState.open && topRightCell.value !== CellValue.bomb) {
      if (topRightCell.value === CellValue.none) {
        newCells = openAdjacentCells(newCells, row - 1, col + 1);
      } else {
        newCells[row - 1][col + 1].state = CellState.visible;
      }
    }
    
    if (leftCell?.state === CellState.open && leftCell.value !== CellValue.bomb) {
      if (leftCell.value === CellValue.none) {
        newCells = openAdjacentCells(newCells, row, col - 1);
      } else {
        newCells[row][col - 1].state = CellState.visible;
      }
    }
    
    if (rightCell?.state === CellState.open && rightCell.value !== CellValue.bomb) {
      if (rightCell.value === CellValue.none) {
        newCells = openAdjacentCells(newCells, row, col + 1);
      } else {
        newCells[row][col + 1].state = CellState.visible;
      }
    }
    
    if (bottomLeftCell?.state === CellState.open && bottomLeftCell.value !== CellValue.bomb) {
      if (bottomLeftCell.value === CellValue.none) {
        newCells = openAdjacentCells(newCells, row + 1, col - 1);
      } else {
        newCells[row + 1][col - 1].state = CellState.visible;
      }
    }
    
    if (bottomCell?.state === CellState.open && bottomCell.value !== CellValue.bomb) {
      if (bottomCell.value === CellValue.none) {
        newCells = openAdjacentCells(newCells, row + 1, col);
      } else {
        newCells[row + 1][col].state = CellState.visible;
      }
    }
    
    if (bottomRightCell?.state === CellState.open && bottomRightCell.value !== CellValue.bomb) {
      if (bottomRightCell.value === CellValue.none) {
        newCells = openAdjacentCells(newCells, row + 1, col + 1);
      } else {
        newCells[row + 1][col + 1].state = CellState.visible;
      }
    }
    if (bottomRightCell !== null) {
      newCells = openAdjacentCells(newCells, row + 1, col + 1);
    }

    return newCells;
}