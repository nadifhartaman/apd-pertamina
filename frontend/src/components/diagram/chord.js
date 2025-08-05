import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ChordDiagram = ({ matrix, categories }) => {
  const ref = useRef(null);

  useEffect(() => {
    const size = 450; // ukuran lebih kecil
    const innerRadius = size / 2 - 40;
    const outerRadius = innerRadius + 10;

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${size / 2},${size / 2})`);

    const chord = d3
      .chordDirected()
      .padAngle(0.03)
      .sortSubgroups(d3.descending);

    const chords = chord(matrix);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const ribbon = d3
      .ribbonArrow()
      .radius(innerRadius - 2)
      .padAngle(1 / innerRadius);

    // const baseColor = "#6495ED"; // cornflowerblue
    // const color = d3.scaleOrdinal(
    //   Array(categories.length).fill(baseColor)
    // );

    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    const color = d3.scaleOrdinal([
      "#aec6cf", // biru muda
      "#cfcfc4", // abu muda
      "#fdfd96", // kuning pastel
      "#ffb347"  // oranye pastel
    ]);

    // Arcs
    svg
      .append("g")
      .selectAll("path")
      .data(chords.groups)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.index));

    // Labels (diperkecil agar tidak tumpang tindih)
    svg
      .append("g")
      .selectAll("text")
      .data(chords.groups)
      .join("text")
      .each((d) => (d.angle = (d.startAngle + d.endAngle) / 2))
      .attr("dy", ".2em")
      .attr("font-size", "20px")
      .attr("transform", (d) => {
        const angle = d.angle;
        const x = Math.sin(angle) * (outerRadius + 10);
        const y = -Math.cos(angle) * (outerRadius + 10);
        return `translate(${x}, ${y})`; // tanpa rotate
      })
      .attr("text-anchor", (d) => (d.angle > Math.PI ? "end" : "start"))
      .text((d) => categories[d.index]);

    // Ribbons
    svg
      .append("g")
      .attr("fill-opacity", 0.3)
      .selectAll("path")
      .data(chords)
      .join("path")
      .attr("d", ribbon)
      .attr("fill", (d) => color(d.source.index))
      .attr("stroke", (d) => d3.rgb(color(d.source.index)).darker())
      .append("title") // Tooltip bawaan SVG
      .text((d) => {
        const from = categories[d.source.index];
        const to = categories[d.target.index];
        const value = d.source.value;
        return `${from} -> ${to}: ${value}`;
      });

    //Ribbons value arrow
    svg
      .append("g")
      .selectAll("text")
      .data(chords)
      .join("text")
      .attr("font-size", "10px")
      .attr("fill", "#333")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("stroke", "#333")
      .attr("transform", (d) => {
        // Ambil posisi tengah titik awal (source)
        const angle = (d.source.startAngle + d.source.endAngle) / 2;
        const x = Math.sin(angle) * innerRadius;
        const y = -Math.cos(angle) * innerRadius;
        return `translate(${x},${y})`;
      })
      .text((d) => d.source.value > 0 ? d.source.value : "");


  }, [matrix, categories]);

  return <div ref={ref} />;
};

export default ChordDiagram;
