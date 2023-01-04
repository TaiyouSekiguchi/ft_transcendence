import {
  BALL_COLOR,
  BALL_SIZE,
  PADDLE_COLOR,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
} from './gameConfig';

export class Ball {
  x: number;
  y: number;
  size: number;

  // 位置はサーバーから取ってくるため初期値必要なし
  constructor() {
    this.x = 0;
    this.y = 0;
    this.size = BALL_SIZE;
  }

  draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = BALL_COLOR;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  };

  setPosition = (x: number, y: number): void => {
    this.x = x;
    this.y = y;
  };
}

export class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
  }

  draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = PADDLE_COLOR;
    ctx.fill();
    ctx.closePath();
  };

  setPosition = (x: number, y: number): void => {
    this.x = x;
    this.y = y;
  };
}

export class Score {
  x: number;
  y: number;
  size: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.size = 0;
  }

  draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = BALL_COLOR;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  };
}
