import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import "./Labyrinth.css";
import Lottie from "lottie-react";
import animationLoading from "../assets/compass-animation.json";
import animationDirection from "../assets/direction-animation.json";

export const Labyrinth = () => {
  const imageRef = useRef();

  const {
    userName,
    loading,
    description,
    actions,
    coordinates,
    setDirection,
    moveDirection,
    error,
    restart,
    setUserName,
  } = useUserStore();

  const [hoveredDirection, setHoveredDirection] = useState(null);

  useEffect(() => {
    if (coordinates) {
      imageRef.current.style.backgroundImage = `url("/${coordinates}.jpg")`;
    }
  }, [coordinates]);

  const handleDirectionClick = (action) => {
    setDirection(action.direction);
    moveDirection(userName, action.direction);
  };

  const handleRestart = () => {
    setUserName("");
    restart();
  };

  // Function to determine grid column and row based on direction
  const getGridPosition = (direction) => {
    switch (direction) {
      case "East":
        return { gridColumn: 3, gridRow: 2 };
      case "West":
        return { gridColumn: 1, gridRow: 2 };
      case "South":
        return { gridColumn: 2, gridRow: 3 };
      case "North":
        return { gridColumn: 2, gridRow: 1 };
      default:
        return {};
    }
  };

  if (loading) {
    return (
      <div className="compass-animation">
        <Lottie animationData={animationLoading} loop={true} />
      </div>
    );
  }

  return (
    <div className="background-image" ref={imageRef}>
      {loading && <div>Loading...</div>}
      {error && (
        <div key="error">
          <h2>{error}</h2>
        </div>
      )}

      {!loading && !error && (
        <div className="content">
          <p className="description">{description}</p>
          <div className="button-grid">
            {actions.map((action) => (
              <div
                key={action.direction}
                style={getGridPosition(action.direction)}>
                <button
                  className="direction-button"
                  value={action.direction}
                  onClick={() => handleDirectionClick(action)}
                  onMouseEnter={() => setHoveredDirection(action.direction)}
                  onMouseLeave={() => setHoveredDirection(null)}>
                  <p>Go {action.direction}</p>
                  {hoveredDirection === action.direction && (
                    <div className="tooltip">{action.description}</div>
                  )}
                </button>
              </div>
            ))}
            <Lottie
              animationData={animationDirection}
              loop={true}
              className="animation-direction"
            />
          </div>
          <button className="button-restart" onClick={handleRestart}>
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};
