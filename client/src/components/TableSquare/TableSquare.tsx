import "./TableSquare.css";
import React, { MouseEventHandler, useCallback } from "react";

interface TableSquareProps {
    className: string;
    handleClick: MouseEventHandler;
}

const TableSquare = ({ className, handleClick }: TableSquareProps) => {
    return (
        <div className={` battle-grid-square ${className}`} onClick={handleClick}>
            
        </div>
    );
}

export default TableSquare;