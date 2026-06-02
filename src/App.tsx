import { useState } from "react";
import jsPDF from "jspdf";
import headHrImage from "./assets/HR-head-signature.png";
// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Person = {
  fullName: string;
  position: string;
};

const positions = [
  "Office Staff",
  "Warehouse Checker",
  "Warehouse Helper",
  "IT Site Manager",
  "HR Staff",
  "Warehouse Incharge",
  "Delivery Agents",
  "Driver",
  "Mechanic",
  "OIC",
  "Delivery Checker",
  "Delivery Helper",
  "DSP",
];

const positionColors: Record<string, string> = {
  "Office Staff": "#60a5fa",
  "Warehouse Checker": "#fb923c",
  "Warehouse Helper": "#4ade80",
  "IT Site Manager": "#a78bfa",
  "HR Staff": "#f87171",
  "Warehouse Incharge": "#facc15",
  "Delivery Agents": "#2dd4bf",
  Driver: "#f87171",
  Mechanic: "#38bdf8",
  OIC: "#c084fc",
  "Delivery Checker": "#22c55e",
  DSP: "#8b5cf6",
};

export default function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState(positions[0]);

  const addPerson = () => {
    if (!fullName || !position) return;

    setPeople((prev) => [...prev, { fullName, position }]);
    setFullName("");
    setPosition(positions[0]);
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [576, 936],
    });

    const cols = 3;
    const rows = 4;
    const perPage = cols * rows;

    const cellW = 576 / cols;
    const cellH = 936 / rows;

    people.forEach((person, index) => {
      // New page every 12 cards
      if (index % perPage === 0 && index !== 0) {
        doc.addPage([576, 936]);
      }

      const positionInPage = index % perPage;

      const col = positionInPage % cols;
      const row = Math.floor(positionInPage / cols);

      const x = col * cellW;
      const y = row * cellH;

      const color = positionColors[person.position] || "#111";

      // ===================================
      // CARD SETTINGS
      // ===================================

      const outerX = x + 12;
      const outerY = y + 12;

      const outerW = cellW - 24;
      const outerH = cellH - 24;

      const borderSize = 8;

      // ===================================
      // OUTER BORDER
      // ===================================

      doc.setFillColor(color);

      doc.roundedRect(outerX, outerY, outerW, outerH, 10, 10, "F");

      // ===================================
      // INNER CARD
      // ===================================

      doc.setFillColor(250, 250, 250);

      doc.roundedRect(
        outerX + borderSize,
        outerY + borderSize,
        outerW - borderSize * 2,
        outerH - borderSize * 2,
        8,
        8,
        "F",
      );

      // ===================================
      // CONTENT POSITIONING
      // ===================================

      const centerX = x + cellW / 2;
      const centerY = y + cellH / 2;

      // ===================================
      // NAME
      // ===================================

      doc.setTextColor(20);
      doc.setFontSize(13);

      doc.text(person.fullName, centerX, centerY - 12, {
        align: "center",
      });

      // ===================================
      // POSITION
      // ===================================

      doc.setFontSize(10);
      doc.setTextColor(90);

      doc.text(person.position, centerX, centerY + 10, {
        align: "center",
      });

      // ===================================
      // SIGNATURE
      // ===================================

      const imgWidth = 70;
      const imgHeight = 25;

      doc.addImage(
        headHrImage,
        "PNG",
        centerX - imgWidth / 2,
        centerY + 32,
        imgWidth,
        imgHeight,
      );
    });
    const today = new Date().toISOString().split("T")[0];

    // Example output:
    // ids-2026-05-18.pdf

    doc.save(`ids-${today}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold">
            BSPI Gatepass Generator System
          </h1>
          <p className="text-gray-500 text-sm">
            Create employee gatepasses and export printable PDF
          </p>
        </div>

        {/* FORM */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Add Employee</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={addPerson}>Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* ACTION */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Total Employees: <b>{people.length}</b>
          </p>

          <Button onClick={generatePDF} disabled={people.length === 0}>
            Generate PDF
          </Button>
        </div>

        {/* LEGEND */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Position Legend</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(positionColors).map(([pos, color]) => (
                <div
                  key={pos}
                  className="flex items-center gap-2 text-xs text-gray-600"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {pos}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* PREVIEW */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>

          <CardContent>
            {people.length === 0 ? (
              <p className="text-gray-400 text-sm">No employees added yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {people.map((p, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm">{p.fullName}</p>
                      <p className="text-xs text-gray-500">{p.position}</p>
                    </div>

                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: positionColors[p.position] || "#000",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
