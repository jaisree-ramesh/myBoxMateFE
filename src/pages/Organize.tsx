import DisplayedSpaces from "../components/Spaces/DisplayedSpaces";
import Spaces from "../components/Spaces/Spaces";
import { useState } from "react";

function Organize() {
  const [refreshTrigger] = useState(0);

  return (
    <main className="organize-container">
      <Spaces />
      <DisplayedSpaces refreshTrigger={refreshTrigger} />
    </main>
  );
}

export default Organize;
