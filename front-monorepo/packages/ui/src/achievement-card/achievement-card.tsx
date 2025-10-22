import "./achievement-card.css";

export default function AchievementCard({
  img,
  title,
  description,
  points,
  locked
}: {
  img?: string;
  title: string;
  description: string;
  points: number;
  locked: boolean;
}) {
  return (
    <>
      <hr></hr>
      <div className="achievement-card">
        <div className="achievement-card-img-box">
          {locked && <img className="achievement-card-img achievement-card-img-locked" src={img}/>}
          {!locked && <img className="achievement-card-img" src={img}/>}
        </div>
        <div className="achievement-card-info">
          <span className="achievement-title">{title}</span>
          <span className="achievement-description">{description}</span>
          {locked && <span className="achievement-points achievement-points-locked">{points} pontos!</span>}
          {!locked && <span className="achievement-points">{points} pontos!</span>}
        </div>
      </div>
      <hr></hr>
    </>
  );
}
