// HTML structure will include a canvas for the map and controls for interaction
// This script assumes you have a folder `maps` with top-down view images of maps and a predefined dictionary of objectives.

const objectives = [
    { id: "A", name: "deep shack", x: 100, y: 150 },
    { id: "B", name: "no man's", x: 200, y: 250 },
    { id: "C", name: "lockers", x: 300, y: 350 },
    { id: "D", name: "shack", x: 400, y: 450 },
    { id: "E", name: "shack ruins", x: 420, y: 450 },
    { id: "F", name: "outside middle", x: 440, y: 450 },
    // Add more objectives with coordinates here
  ];
  
  const layouts = [
    {"A": 1, "B": 1, "C": 0, "D": 0, "E": 0, "F": 0, "G": 1, "H": 1, "I": 1, "J": 1, "K": 0, "L": 1},
    {"A": 1, "B": 0, "C": 0, "D": 1, "E": 0, "F": 1, "G": 1, "H": 0, "I": 1, "J": 1, "K": 0, "L": 1},  
    {"A": 0, "B": 1, "C": 1, "D": 1, "E": 0, "F": 0, "G": 0, "H": 1, "I": 1, "J": 1, "K": 0, "L": 1}, 
    {"A": 1, "B": 0, "C": 1, "D": 0, "E": 1, "F": 1, "G": 0, "H": 1, "I": 0, "J": 1, "K": 1, "L": 0}, 
    {"A": 0, "B": 1, "C": 0, "D": 0, "E": 1, "F": 0, "G": 1, "H": 1, "I": 1, "J": 1, "K": 1, "L": 0},  
  ];
  
  // App state
  let selectedMap = "map1.jpg"; // Default map
  let objectiveStates = {}; // Track the state of each objective: "ignored", "enabled", or "disabled"
  objectives.forEach((obj) => (objectiveStates[obj.id] = "ignored"));
  
  const canvas = document.getElementById("mapCanvas");
  const ctx = canvas.getContext("2d");
  const mapImage = new Image();
  mapImage.src = `maps/${selectedMap}`;
  
  mapImage.onload = () => {
    drawMap();
  };
  
  function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
  
    objectives.forEach((objective) => {
      const state = objectiveStates[objective.id];
      let opacity = 0.5;
      let iconColor = "gray";
  
      if (state === "enabled") {
        opacity = 1;
        iconColor = "green";
      } else if (state === "disabled") {
        opacity = 1;
        iconColor = "red";
      }
  
      // Draw objective icon
      ctx.globalAlpha = opacity;
      ctx.fillStyle = iconColor;
      ctx.beginPath();
      ctx.arc(objective.x, objective.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
  
      // Add objective name
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText(objective.name, objective.x + 12, objective.y);
    });
  }
  
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
  
    objectives.forEach((objective) => {
      const distance = Math.sqrt(
        Math.pow(clickX - objective.x, 2) + Math.pow(clickY - objective.y, 2)
      );
  
      if (distance < 10) {
        // Cycle through states: ignored -> enabled -> disabled -> ignored
        if (objectiveStates[objective.id] === "ignored") {
          objectiveStates[objective.id] = "enabled";
          updateObjectiveStates(objective.id, true);
        } else if (objectiveStates[objective.id] === "enabled") {
          objectiveStates[objective.id] = "disabled";
          updateObjectiveStates(objective.id, false);
        } else {
          objectiveStates[objective.id] = "ignored";
        }
  
        drawMap();
      }
    });
  });
  
  function updateObjectiveStates(clickedId, isEnabled) {
    layouts.forEach((layout) => {
      if (layout[clickedId] === (isEnabled ? 1 : 0)) {
        for (const [key, value] of Object.entries(layout)) {
          if (value === 1 && isEnabled) {
            objectiveStates[key] = "enabled";
          } else if (value === 0 && !isEnabled) {
            objectiveStates[key] = "disabled";
          }
        }
      }
    });
  }
  
  // Example controls to switch maps
  document.getElementById("mapSelector").addEventListener("change", (event) => {
    selectedMap = event.target.value;
    mapImage.src = `maps/${selectedMap}`;
  });
  