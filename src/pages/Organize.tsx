import DisplayedSpaces from "../components/spaces/DisplayedSpaces";
import Spaces from "../components/spaces/Spaces";
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
