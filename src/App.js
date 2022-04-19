import Spline from "@splinetool/react-spline";
import { useEffect, useState } from "react";
import { Song, Track, Instrument, Effect } from "reactronica";
import _ from "lodash";
import anime from "animejs";

function App() {
  const [notes, setNotes] = useState([]);
  const [bitCrusher, setBitcrusher] = useState(0);
  const [spline, setSpline] = useState();

  const onKeyDown = (e) => {
    setNotes((notes) => _.uniqBy([...notes, { name: e.target.name }], "name"));
  };
  const onKeyUp = (e) => {
    setNotes((notes) => notes.filter((note) => note.name !== e.target.name));
  };
  useEffect(() => {
    if (!spline) return;
    const knob = spline.findObjectByName("knob");
    knob.position.x = -130 + bitCrusher * 150;
  }, [bitCrusher, spline]);
  useEffect(() => {
    if (!spline) return;
    const bulb = spline.findObjectByName("lightbulb");
    anime({
      targets: bulb.scale,
      x: Math.min(notes.length * 0.8, 1.2),
      y: Math.min(notes.length * 0.8, 1.2),
      z: Math.min(notes.length * 0.8, 1.2),
    });
  }, [notes, spline]);
  return (
    <>
      <Spline
        scene="https://draft.spline.design/cpYpRwJFOf16GiEm/scene.spline"
        onMouseDown={onKeyDown}
        onMouseUp={onKeyUp}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onLoad={(spline) => setSpline(spline)}
      />
      <Song>
        <Track>
          <Instrument type="synth" notes={notes}></Instrument>
          <Effect type="bitCrusher" wet={bitCrusher} />
        </Track>
      </Song>
      <div className="fixed top-0 left-0 right-0 p-5 bg-white bg-opacity-40 text-xs">
        <label>
          BitCrusher 🎸 ({bitCrusher})<br />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={bitCrusher}
            onChange={(e) => setBitcrusher(e.target.value)}
          ></input>
        </label>
        <div>{notes.map((n) => n.name).join(", ")}</div>
      </div>
    </>
  );
}

export default App;
