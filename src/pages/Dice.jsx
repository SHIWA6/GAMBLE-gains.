import { useEffect, useRef, useState } from "react";
import Loader from "../secure/component/Loader"
import loop from "../assets//roll-over.svg"
import sliderSound from "../assets//tickDrag.mp3";
import winSound from "../assets//betClick.mp3"
import betSound from "../assets//betClick.mp3"
import rollSound from "../assets//rolling.mp3";
import ruppee from "../assets//ruppee.svg";
import DiceNumber from "../secure/component/DiceNumber";
import { getDiceNumber } from "../secure/component/GetDice";

// ✅ Small Component for showing results
function ShowBetResult({ amount, win }) {
  return (
    <div
      className={`px-3 py-2 rounded-lg shadow-md font-bold text-sm ${
        win ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      🎲 {amount}
    </div>
  );
}

export default function Dice() {
  const [totalAmount, setTotalAmount] = useState(1000);
  const [isBetStarted, setisBetStarted] = useState(false);
  const [BetAmount, SetBetAmount] = useState("");
  const [mul, setMul] = useState((1.1).toFixed(4));
  const [betResultArray, setBetResultArray] = useState([]);
  const [rollvalue, setRollValue] = useState(10);
  const [showDice, setShowDice] = useState(false);
  const [recentNumber, setRecentnumber] = useState(0);

  // ✅ new state for +won amount
  const [wonAmount, setWonAmount] = useState(0);
  const [showWonAmount, setShowWonAmount] = useState(false);

  const diceTimeout = useRef(null);
  const imgRef = useRef();

  const sliderAudio = new Audio(sliderSound);
  const winAudio = new Audio(winSound);
  const betAudio = new Audio(betSound);
  const rollAudio = new Audio(rollSound);

  // ✅ Gradient update on slider change
  useEffect(() => {
    const slider = document.querySelector(".slider");
    if (slider) {
      const percentage =
        ((rollvalue - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.background = `linear-gradient(to right, #e9113c ${percentage}%, #00e701 ${percentage}%)`;
    }
  }, [rollvalue]);

  // ✅ Hide won amount automatically after 2 sec
  useEffect(() => {
    if (showWonAmount) {
      const timeout = setTimeout(() => setShowWonAmount(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [showWonAmount]);

  // ✅ BET Click Handler
  const handleBetClicked = () => {
    const bet = parseFloat(BetAmount);
    const multiplier = parseFloat(mul);

    if (isNaN(bet) || bet <= 0) {
      alert("Enter a valid bet amount (must be > 0)");
      return;
    }

    if (bet > totalAmount) {
      alert("Not Enough Money");
      return;
    }

    betAudio.play();
    clearTimeout(diceTimeout.current);
    setisBetStarted(true);

    setTimeout(() => {
      rollAudio.play();
    }, 300);

    const timeout1 = setTimeout(() => {
      const diceNumber = getDiceNumber();
      setRecentnumber(diceNumber);

      let newBetResultArray;

      if (diceNumber >= rollvalue) {
        // ✅ WIN
        const profit = parseFloat((multiplier - 1) * bet);
        setTotalAmount((amt) => parseFloat(amt) + profit);

        // ✅ show +WonAmount
        setWonAmount(profit.toFixed(2));
        setShowWonAmount(true);

        newBetResultArray = [
          ...betResultArray,
          { amount: diceNumber, win: true },
        ];
        winAudio.play();
      } else {
        // ❌ LOSE
        setTotalAmount((amt) => parseFloat(amt) - bet);

        newBetResultArray = [
          ...betResultArray,
          { amount: diceNumber, win: false },
        ];
      }

      if (newBetResultArray.length > 5) {
        newBetResultArray = newBetResultArray.slice(-5);
      }

      setBetResultArray(newBetResultArray);
      setShowDice(true);
      setisBetStarted(false);
    }, 500);

    const timeout2 = setTimeout(() => {
      setShowDice(false);
    }, 3000);

    diceTimeout.current = timeout2;
  };

  // ✅ Slider change
  const handleSliderchange = (e) => {
    sliderAudio.play();
    setRollValue(e.target.value);
    setMul(parseFloat(99 / (100 - e.target.value)).toFixed(4));
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0f1a] via-[#0d1723] to-[#0a0f1a] min-h-screen pt-8 px-4 text-white">
      <Loader />

      <div className="bg-gradient-to-br from-[#101c2a] to-[#0a131d] max-w-screen-xl m-auto rounded-xl overflow-hidden max-h-[85vh] h-full shadow-2xl shadow-[#00f0ff40] border border-[#1e2f44]">
        <div className="grid grid-cols-4 h-full gap-4">
          {/* Left Sidebar */}
          <div className="md:col-span-1 md:order-first order-last col-span-4 bg-gradient-to-b from-[#142736] to-[#0e1b27] p-5 rounded-xl shadow-lg shadow-[#00f0ff20] border border-[#1e2f44]">
            <div className="flex flex-col gap-4">
              {/* Bet Amount Input */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="betamount"
                  className="text-slate-300 text-sm font-medium tracking-wide"
                >
                  Bet Amount
                </label>

                <div className="bg-gradient-to-r from-[#00f0ff] to-[#00ffa3] p-0.5 rounded-lg flex">
                  <div className="flex bg-[#0c1a24] items-center grow pr-2 rounded-md">
                    <input
                      disabled={isBetStarted}
                      id="betAmount"
                      type="number"
                      min="1"
                      value={BetAmount}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value));
                        SetBetAmount(val);
                      }}
                      className="bg-transparent text-slate-100 py-2 px-3 rounded-md text-sm font-medium border border-[#1f3444] focus:outline-none focus:ring-2 focus:ring-[#00ffa3] w-full"
                    />
                  </div>
                </div>

                {/* Profit on Win */}
                <div className="flex flex-col gap-1">
                  <div className="text-slate-300 text-sm font-medium">
                    Profit on Win
                  </div>
                  <div className="bg-gradient-to-r from-[#1e2f44] to-[#172433] text-slate-100 px-3 py-2 rounded-md border border-[#2b4255] shadow-inner flex justify-between items-center transition-all duration-200">
                    <span>
                      {parseFloat((BetAmount || 0) * (mul - 1)).toFixed(2)}
                    </span>
                    <img className="w-4 h-4" src={ruppee} />
                  </div>
                </div>
              </div>

              {/* Bet Button */}
              <button
                disabled={isBetStarted}
                onClick={handleBetClicked}
                className={`w-full rounded-lg py-3 font-semibold shadow-lg shadow-[#00ffa350] transition-all duration-300 ${
                  isBetStarted
                    ? "bg-[#00ffa3] opacity-50 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#00ffa3] to-[#00f0ff] hover:shadow-[0_0_20px_#00ffa380]"
                }`}
              >
                BET
              </button>

              {/* Total Balance */}
              <div className="mt-4 relative">
                <div className="flex flex-col gap-1">
                  <div className="text-slate-300 text-sm font-medium">
                    Total Balance
                  </div>
                  <div className="bg-gradient-to-r from-[#1e2f44] to-[#172433] text-slate-100 px-3 py-3 rounded-md border border-[#2b4255] shadow-inner flex justify-between items-center transition-all duration-200 relative">
                    <span className="text-lg font-bold">
                      {parseFloat(totalAmount).toFixed(2)}
                    </span>
                    <img className="w-5 h-5" src={ruppee} alt="currency" />
                  </div>

                  {/* ✅ +WonAmount Notation */}
                  {showWonAmount && (
                    <span className="absolute top-full left-0 mt-1 text-green-400 font-bold animate-bounce">
                      +{wonAmount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className=" mt-9 md:col-span-3 col-span-4 relative w-full p-4">
            {/* ✅ Bet Results */}
            <div className="absolute top-0 right-4 flex gap-2 max-w-96 w-fit overflow-hidden">
              {betResultArray.map((item, index) => (
                <ShowBetResult key={index} amount={item.amount} win={item.win} />
              ))}
            </div>

            {/* Slider Section */}
            <div className="h-full flex">
              <div className="bg-gradient-to-b from-[#1e2f44] to-[#162534] max-w-screen-md w-full m-auto p-4 sm:p-6 rounded-full relative mb-48 sm:mb-80 mt-12 shadow-lg shadow-[#00f0ff40] border border-[#2f4553]">
                <div className="bg-[#0F212E] flex flex-col justify-center p-4 rounded-full m-auto shadow-inner shadow-[#00f0ff20]">
                  <input
                    ref={imgRef}
                    disabled={isBetStarted}
                    onChange={handleSliderchange}
                    type="range"
                    min="2"
                    max="98"
                    value={rollvalue}
                    className="slider accent-[#00ffa3] hover:accent-[#00f0ff] cursor-pointer"
                  />
                  <DiceNumber
                    hidden={!showDice}
                    amount={recentNumber}
                    win={recentNumber >= rollvalue}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 right-4 left-4 bg-gradient-to-r from-[#142736] to-[#0e1b27] rounded-lg flex p-4 gap-4 shadow-lg shadow-[#00f0ff20] border border-[#1e2f44]">
              {/* Multiplier */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-slate-300 text-sm font-medium">
                  Multiplier
                </label>
                <div className="flex bg-[#0f1a24] items-center pr-2 border-2 border-[#1f3444] rounded-md">
                  <input
                    disabled={isBetStarted}
                    onChange={(e) => {
                      setMul(e.target.value);
                      setRollValue(100 - 99 / e.target.value);
                    }}
                    id="targetMul"
                    className="bg-transparent text-slate-100 py-2 px-3 rounded-md text-sm font-medium w-full"
                    type="number"
                    value={mul}
                  />
                  <span>X</span>
                </div>
              </div>

              {/* Roll Over */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-slate-300 text-sm font-medium">
                  Roll Over
                </label>
                <div className="flex bg-[#0f1a24] items-center pr-2 border-2 border-[#1f3444] rounded-md">
                  <input
                    disabled
                    id="roll"
                    className="bg-transparent text-slate-100 py-2 px-3 rounded-md text-sm font-medium w-full"
                    type="number"
                    value={parseFloat(rollvalue).toFixed(2)}
                  />
                  <img className="w-5" src={loop} />
                </div>
              </div>

              {/* Win Percentage */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-slate-300 text-sm font-medium">
                  Win Percentage
                </label>
                <div className="flex bg-[#0F1A24] items-center pr-2 border border-[#1f3444] rounded-md">
                  <input
                    disabled
                    className="bg-transparent text-slate-100 py-2 px-3 rounded-md text-sm font-medium w-full"
                    type="number"
                    value={parseFloat(100 - rollvalue).toFixed(4)}
                  />
                  <span className="text-[#00ffa3] text-lg font-bold">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

