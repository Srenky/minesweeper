import React from "react";

import './board.css';

import { Button } from "../Button/button";

import { generateCells, openAdjacentCells } from "../../utils/helpers";
import { Face, CellState, CellValue, Cell} from "../../types/types";
import { MAX_HEIGHT, MAX_WIDTH, N_OF_MINES } from '../../constants/constants';

export const Board: React.FC = () => {

    const [board, setBoard] = React.useState<Cell[][]>(generateCells());
    const [flags, setFlags] = React.useState<number>(0);
    const [mines, setMines] = React.useState<number>(N_OF_MINES);
    const [time, setTime] = React.useState<number>(0); 
    const [face, setFace] = React.useState<Face>(Face.smile);
    const [live, setLive] = React.useState<boolean>(false);
    const [gameOver, setGameOver] = React.useState<boolean>(false);

    React.useEffect(() => {
        let timer: NodeJS.Timer;
        if (live) {
            timer = setInterval(() => {
                setTime(time + 1);
            }, 1000);
    
            return () => {
                clearInterval(timer);
            };
        }
        else {
            return () => {
                clearInterval(timer);
            };
        }
    }, [live, time]);

    const showAllMines = () => {
        for (let row = 0; row < MAX_HEIGHT; row++) {
            for (let col = 0; col < MAX_WIDTH; col++) {
                if (board[row][col].state === CellState.open && board[row][col].value === CellValue.bomb) {
                    board[row][col].state = CellState.visible;
                }
            }
        }
    }

    const flagAllMines = () => {
        for (let row = 0; row < MAX_HEIGHT; row++) {
            for (let col = 0; col < MAX_WIDTH; col++) {
                if (board[row][col].state === CellState.open && board[row][col].value === CellValue.bomb) {
                    board[row][col].state = CellState.flagged;
                }
            }
        }
    }

    const handleButtonClick = (row: number, col: number) => (): void => {
        // clicking shouldn't do anything if game has ended
        if (gameOver) {
            return;
        }

        // clicking on this cell shouldn't do anything
        if (board[row][col].state === CellState.visible ||
            board[row][col].state === CellState.flagged) {
            return;
        }

        let newBoard = board.slice();

        // make sure player doesn't click on mine for the first time
        if (!live) {
            setLive(true);
            while (newBoard[row][col].value === CellValue.bomb) {
                newBoard = generateCells();
            }
        }

        // player lost
        if (newBoard[row][col].value === CellValue.bomb) {
            showAllMines();
            setLive(false);
            setGameOver(true);
            setFace(Face.lost);
        } else if (newBoard[row][col].value === CellValue.none) {
            newBoard = openAdjacentCells(newBoard, row, col);
        } else {
            newBoard[row][col].state = CellState.visible;
        }
        
        // check if player won
        let isOpenCell = false;
        for (let row = 0; row < MAX_HEIGHT; row++) {
            for (let col = 0; col < MAX_WIDTH; col++) {
                if (newBoard[row][col].state === CellState.open && 
                    newBoard[row][col].value !== CellValue.bomb) {
                        isOpenCell = true;
                    break;
                }
            }
        }

        if (!isOpenCell) {
            flagAllMines();
            setMines(0);
            setLive(false);
            setGameOver(true);
            setFace(Face.won);
        }

        setBoard(newBoard);
    }

    const handleContextClick = (row: number, col: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault();
        
        // clicking shouldn't do anything if game has ended
        if (gameOver) {
            return;
        }

        if (board[row][col].state === CellState.visible) {
            return;
        }

        let newBoard = board.slice();

        if (board[row][col].state === CellState.open) {
            newBoard[row][col].state = CellState.flagged;
            setMines(mines - 1);
            if (board[row][col].value === CellValue.bomb) {
                setFlags(flags + 1);
            }
        }
        else if (board[row][col].state === CellState.flagged) {
            newBoard[row][col].state = CellState.open;
            setMines(mines + 1);
            if (board[row][col].value === CellValue.bomb) {
                setFlags(flags - 1);
            }
        }

        setBoard(newBoard);
    }

    const handleFaceClick = ():void => {
        setBoard(generateCells());
        setMines(N_OF_MINES);
        setFlags(0);
        setTime(0);
        setLive(false);
        setGameOver(false);
        setFace(Face.smile);
    }

    const renderCells = (): React.ReactNode => {
        return board.map((row, rowIdx) => 
            <div>
                {row.map((cell, colIdx) =>
                    <Button
                        col={colIdx}
                        row={rowIdx}
                        key={`${rowIdx}-${colIdx}`}
                        state={cell.state}
                        value={cell.value}
                        onClick={handleButtonClick}
                        onContext={handleContextClick}
                    />
                )}
            </div>)
    };

    const renderFace = (): React.ReactNode => {
        return <span>{face}</span>
    }

    const renderMineCount = (): React.ReactNode => {
        if (mines > 99) {
            return <span>{mines}</span>
        } else if (mines > 9) {
            return <span>0{mines}</span>
        } else {
            return <span>00{mines}</span>
        } 
    }

    const renderTime = (): React.ReactNode => {
        if (time > 999) {
            return <span>999</span>
        } else if (time > 99) {
            return <span>{time}</span>
        } else if (time > 9) {
            return <span>0{time}</span>
        } else {
            return <span>00{time}</span>
        } 
    }

    return (<>
        <div className='Head'>
            <div className='NumberDisplay'>{renderMineCount()}</div>
            <button className='Face' onClick={handleFaceClick}>{renderFace()}</button>
            <div className='NumberDisplay'>{renderTime()}</div>
        </div>
        <div onMouseDown={() => {setFace(Face.oh)}} onMouseUp={() => {setFace(Face.smile)}}>{renderCells()}</div>
    </>
    )
}