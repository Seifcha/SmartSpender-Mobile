// utils.js
export const CHART_COLORS = {
  blue: "rgba(54, 162, 235, 1)",
  red: "rgba(255, 99, 132, 1)",
  // Ajoutez d'autres couleurs si nécessaire
};

export const transparentize = (color, opacity = 0.5) => {
  const alpha = Math.round(opacity * 255);
  return color.replace("1)", `${alpha / 255})`);
};
