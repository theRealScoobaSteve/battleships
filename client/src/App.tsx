import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import io from 'socket.io-client';
import Container from "react-bootstrap/Container";
import TableSquare from "./components/TableSquare";
import React, { useEffect, useState } from 'react';

interface GridTile {
  id: number;
  xCoord: number;
  yCoord: number;
  event: Event;
}

interface Event {
  id: number;
  machineName: string;
}

interface Player {
  id: number;
  socketId: string;
  targetGrid: Array<GridTile>;
  shipGrid: Array<GridTile>;
  isPlayersTurn: boolean;
}

interface WinLossData {
  win: boolean;
  loss: boolean;
}

const socket = io('http://localhost:8080', {
  transports: ['polling'],
});
function App() {
  const initialGrid: any = {};
  const [gridStore, setGridStore] = useState(initialGrid);

  useEffect(() => {
    socket.on("update_grid", (gridData: Player) => {
        console.log(gridData)
        setGridStore(gridData);
    });

    socket.on("check_win", ({ win, loss }: WinLossData) => {
        if (win) {
          alert("You Win!!!");
        }

        if (loss) {
          alert("You Lost, Get Luckier Next Time!!!");
        }
    });
    
    return () => socket.disconnect() as any;
  }, []);
  
  const updateGrid = (gridType: string) : Array<JSX.Element> => {
    const grid: Array<JSX.Element> = [];
    console.log(gridStore[gridType])
    if (gridStore[gridType]) {
      for (let y = 11; y > -1; --y) {
        // get the all the y coordinates
        const yAxis: Array<GridTile> = gridStore[gridType].gridTiles.filter((gridTile: GridTile) => {
          return y === gridTile.yCoord;
        });

        const sortedRow = yAxis.sort((a: GridTile, b: GridTile) => {
          return a.xCoord  - b.xCoord;
        });
        
        const jsxRow = sortedRow.map((tile: GridTile): JSX.Element => {
          const { id, xCoord, yCoord, event: { machineName } } = tile;
          
          return (
            <Col key={id} className="no-gutter">
              <TableSquare className={machineName} handleClick={() => {
                // if (gridStore.isPlayersTurn) {
                  socket.emit("fire_event", { xCoord, yCoord, id });
                // }
              }}/>
            </Col>
          );
        });

        grid.push(addRow(jsxRow));
      } 
    }

    return grid;
  }

  const addRow = (row: Array<JSX.Element>): JSX.Element => {
    return (
      <Row>
        {row}
      </Row>
    );
  }
  
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-center">Let's Play Battleship</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          {updateGrid("targetGrid")}
        </Col>
      </Row>
      <Row className="bottom-spacing"></Row>
      <Row>
        <Col>
          {updateGrid("shipGrid")}
        </Col>
      </Row>
    </Container>
  );
}



export default App;
