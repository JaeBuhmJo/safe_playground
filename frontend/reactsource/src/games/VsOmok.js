import { Button, Card, Container, Stack } from "react-bootstrap";
import "./VsOmok.css";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import placeStoneSound from "./../sounds/place_stone.mp3";

function VsOmok() {
  const cellSize = 44;

  let boardInit = [];
  for (let i = 0; i < 19; i++) {
    let row = [];
    for (let j = 0; j < 19; j++) {
      row.push(0);
    }
    boardInit.push(row);
  }
  const [user1, setUser1] = useState({});
  const [user2, setUser2] = useState({});
  const [board, setBoard] = useState(boardInit);
  const [isBlack, setisBlack] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: -8000, y: -8000 });

  useEffect(() => {
    console.log("mount");

    return () => {
      console.log("unmount");
    };
  }, [user1, user2]);

  function BoardClick(event) {
    //유저의 착수 요청이 있을 경우 좌표를 얻어낸다
    const rect = document.querySelector(".omokBoard").getBoundingClientRect();
    const x = event.clientX - rect.left + 22;
    const y = event.clientY - rect.top + 22;
    const row = Math.round(y / cellSize) - 1;
    const col = Math.round(x / cellSize) - 1;

    if (row < 0 || row > 18 || col < 0 || col > 18 || board[row][col] > 0) {
      //돌이 이미 놓여 있거나 클릭이 영역을 벗어난 경우 리턴
      return;
    }
    PlaceStone({ row, col, isBlack });
  }

  function BoardMouseMove(event) {
    //유저의 착수 예정 지점을 표시
    const rect = document.querySelector(".omokBoard").getBoundingClientRect();
    const x = event.clientX - rect.left + 22;
    const y = event.clientY - rect.top + 22;
    const row = Math.round(y / cellSize) - 1;
    const col = Math.round(x / cellSize) - 1;

    if (row < 0 || row > 18 || col < 0 || col > 18 || board[row][col] > 0) {
      //돌이 이미 놓여있거나 커서가 영역을 벗어난 경우 미표시
      setMousePosition({ x: -8000, y: -8000 });
      return;
    }
    if (row * cellSize + 3 !== mousePosition.x || col * cellSize + 3 !== mousePosition.y) {
      console.log(mousePosition);
      setMousePosition({ x: row * cellSize + 3, y: col * cellSize + 3 });
    }
  }

  const [play] = useSound(placeStoneSound);

  function PlaceStone({ row, col, isBlack }) {
    //axios로 착수 요청하는 로직

    //33 착수금지

    //승리

    //앞에 걸리지 않으면, 착수완료. setBoard
    let newBoard = board.map((row) => row.slice());
    newBoard[row][col] = isBlack ? 1 : 2;
    setisBlack(!isBlack);
    setBoard(newBoard);
    setMousePosition({ x: -8000, y: -8000 });
    play();
  }

  function Stones() {
    return (
      <>
        {board.map((row, x) => (
          <div key={x}>
            {row.map((val, y) => {
              if (val == 0) {
                return;
              }
              return <div key={y} className={val === 1 ? "stone blackStone" : "stone whiteStone"} style={{ left: y * cellSize + 3, top: x * cellSize + 3 }} />;
            })}
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      <Container onContextMenu={preventContextMenu}>
        <h1>VsOmok</h1>
        <Stack direction="horizontal" gap={3}>
          <div className="omokBoard mt-3" onClick={BoardClick} onMouseMove={BoardMouseMove}>
            <Stones />
            <div className={isBlack ? "stone blackStone transparent" : "stone whiteStone transparent"} style={{ left: mousePosition.y, top: mousePosition.x }} />
          </div>
          <div gap={3}>
            <UserCard user={user1} />
            <UserCard user={user2} />
          </div>
        </Stack>
      </Container>
      <Footer />
    </>
  );
}

const UserCard = ({ user }) => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src="./logo192.png" />
      <Card.Body>
        <Card.Title>사용자 ID</Card.Title>
        <Card.Text>한 수 부탁드립니다.</Card.Text>
        <Button variant="primary">전적 보기</Button>
      </Card.Body>
    </Card>
  );
};

const Footer = () => {
  return (
    <div className="mt-5">
      <p>
        바둑판 이미지 출처 :
        <span>
          <a href="https://commons.wikimedia.org/wiki/File:Blank_Go_board.png" target="_blank" rel="noreferrer">
            Dbenbenn, Public domain, via Wikimedia Commons
          </a>
        </span>
      </p>
      <p>
        흰 바둑돌 이미지 출처 :
        <span>
          <a href="https://ko.wikipedia.org/wiki/%ED%8C%8C%EC%9D%BC:Go_w_no_bg.svg" target="_blank" rel="noreferrer">
            Micheletb, CC BY-SA 3.0, via Creative Commons
          </a>
        </span>
      </p>
      <p>
        검은 바둑돌 이미지 출처 :
        <span>
          <a href="https://ko.wikipedia.org/wiki/%ED%8C%8C%EC%9D%BC:Go_b_no_bg.svg" target="_blank" rel="noreferrer">
            Micheletb, CC BY-SA 3.0, via Creative Commons
          </a>
        </span>
      </p>
      <p>
        바둑돌 착수음 출처 :
        <span>
          <a href="https://soundbible.com/1442-Cupboard-Door-Close.html#" target="_blank" rel="noreferrer">
            Caroline Ford, Attribution 3.0, via Creative Commons
          </a>
        </span>
      </p>
    </div>
  );
};

function preventContextMenu(event) {
  event.preventDefault();
}

export default VsOmok;
