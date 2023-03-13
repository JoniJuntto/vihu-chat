import { ChangeEvent, SetStateAction, useState } from 'react';

export default function TransparencySlider({ setTransparency }: { setTransparency: React.Dispatch<SetStateAction<number>>}) {
    const [sliderValue, setSliderValue] = useState(50);

  const handleTransparencyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setSliderValue(value);
    setTransparency(value / 100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
      <h2>Set transparency</h2>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={sliderValue} 
        className="slider"
        id="myRange" 
        onChange={(e)=>handleTransparencyChange(e)}
      />
    </div>
  );
}
