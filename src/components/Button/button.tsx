import React from "react";
import { CellState, CellValue } from "../../types/types";

import './button.css'


interface ButtonProps {
    col: number;
    onClick(rowParam: number, colParam: number): (...args: any[]) => void;
    onContext(rowParam: number, colParam: number): (...args: any[]) => void;
    row: number;
    state: CellState;
    value: CellValue;
}

export const Button: React.FC<ButtonProps> = (
    {col, onClick, onContext, row, state, value}
) => {

    const renderContent = (): React.ReactNode => {
        if (state === CellState.visible) {
          if (value === CellValue.bomb) {
            return <img src="https://esraa-alaarag.github.io/Minesweeper/images/bomb.png" alt="" />;
          } else if (value === CellValue.none) {
            return <img src="https://siennapatti.com/wp-content/uploads/2015/04/graysquare.jpg" alt="" />;  
            // return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Minesweeper_0.svg/1024px-Minesweeper_0.svg.png" alt="" />
          } else if (value === CellValue.one) {
            return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Minesweeper_1.svg/1200px-Minesweeper_1.svg.png" alt="" />;
          } else if (value === CellValue.two) {
            return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Minesweeper_2.svg/1200px-Minesweeper_2.svg.png" alt="" />;
          } else if (value === CellValue.three) {
            return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Minesweeper_3.svg/1024px-Minesweeper_3.svg.png" alt="" />;
          } else if (value === CellValue.four) {
            return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Minesweeper_4.svg/1024px-Minesweeper_4.svg.png" alt="" />;
          } else if (value === CellValue.five) {
            return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Minesweeper_5.svg/1024px-Minesweeper_5.svg.png" alt="" />;
          } else if (value === CellValue.six) {
            return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Minesweeper_6.svg/1024px-Minesweeper_6.svg.png" alt="" />;
          } else if (value === CellValue.seven) {
            return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Minesweeper_7.svg/1024px-Minesweeper_7.svg.png" alt="" />;
          } else if (value === CellValue.eight) {
            return <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Minesweeper_8.svg/1024px-Minesweeper_8.svg.png" alt="" />;
          }
          return value;
        } else if (state === CellState.flagged) {
          return <img src="https://cdn0.iconfinder.com/data/icons/basic-ui-elements-flat/512/flat_basic_home_flag_-512.png" alt="" />
        }

        return null;
    };

    return (
        <button onClick={onClick(row, col)} onContextMenu={onContext(row ,col)}>{renderContent()}</button>
    )

}
    