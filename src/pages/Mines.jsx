import React, { useState, useEffect, useRef, useCallback } from "react";
import Loader from "../secure/component/Loader";
import ruppee from "../assets/ruppee.svg";
import Popup from "../secure/component/Popup";
import LostPopup from "./LostPopup";
import bomb2 from "../assets/bomb2.svg";
import gem from "../assets/gem.svg";
import gemSound from "../assets//audio-mines-2.mp3";

export default function Mines() {
  const array = [];
  for (let i = 1; i <= 24; i++) array.push(i);

  const [TotalAmount, setTotalAmount] = useState(100000);
  const [isBetStarted, setIsBetStarted] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [bombIndices, setBombIndices] = useState([]);
  const [noOfBombs, setNoofBombs] = useState(3);
  const [profitRatio, setProfitRatio] = useState(1.0);
  const [totalProfit, setTotalProfit] = useState(0.0);
  const [showPop, setShowPop] = useState(false);
  const [clickedIndices, setClickedIndices] = useState([]);
  const [showLostPop, setShowLostPop] = useState(false);
  const [sentBet, setSentBet] = useState(0);
  const [firstBombClicked, setFirstBombClicked] = useState(false);
  const gemAudioRef = useRef(null);
  const [visibleImages, setVisibleImages] = useState(Array(25).fill(false));
  const [showCashAnimation, setShowCashAnimation] = useState(false);

  const score = useRef(0);

  useEffect(() => {
    if (firstBombClicked) {
      setShowLostPop(true);
      setIsBetStarted(false);
    }
  }, [firstBombClicked]);

  const animationEffect = (e) => {
    e.target.classList.add("animate-ping");
    setTimeout(() => {
      e.target.classList.remove("animate-ping");
    }, 600);
  };

  const reset = () => {
    setTotalProfit(0.0);
    setProfitRatio(1.0);
    setShowLostPop(false);
    setShowPop(false);
    setVisibleImages(Array(25).fill(false));
    setClickedIndices([]);
    setFirstBombClicked(false);
    score.current = 0;
  };

  const calculatePayout = (bet, totalCells, bombs, gemsClicked) => {
    if (gemsClicked <= 0) return bet;
    const multiplier = Math.pow(totalCells / (totalCells - bombs), gemsClicked);
    return bet * multiplier;
  };

  const handleClick = useCallback(
    (e, index) => {
      if (!isBetStarted || firstBombClicked || visibleImages[index]) return;

      animationEffect(e);

      setTimeout(() => {
        if (bombIndices.includes(index)) {
          setClickedIndices((prev) => [...prev, index]);
          setFirstBombClicked(true);
          setVisibleImages(Array(25).fill(true));
        } else {
          if (gemAudioRef.current) {
            gemAudioRef.current.currentTime = 0;
            gemAudioRef.current.play();
          }
          const payout = calculatePayout(
            betAmount,
            25,
            noOfBombs,
            score.current + 1
          );
          setProfitRatio(payout / betAmount);
          setTotalProfit(payout - betAmount);

          setVisibleImages((prev) => {
            const newVisibleImage = [...prev];
            newVisibleImage[index] = true;
            return newVisibleImage;
          });

          if (noOfBombs + clickedIndices.length + 1 === 25) {
            setSentBet(parseFloat(payout));
            setIsBetStarted(false);
            setShowPop(true);
            setTotalAmount((amt) => amt + payout);
            triggerCashAnimation();
          }
          setClickedIndices((prev) => [...prev, index]);
          score.current = score.current + 1;
        }
      }, 500);
    },
    [isBetStarted, firstBombClicked, visibleImages, bombIndices, betAmount, clickedIndices, noOfBombs]
  );

  const getRandomIndices = (k, n = 25) => {
    if (k < 1 || k >= n) return [];
    const indices = Array.from({ length: n }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, k);
  };

  const triggerCashAnimation = () => {
    setShowCashAnimation(true);
    setTimeout(() => setShowCashAnimation(false), 1500);
  };

  const handleBetClicked = () => {
    if (betAmount <= 0) {
      alert("Enter a valid bet!");
      return;
    }
    if (isBetStarted) {
      setSentBet(betAmount + totalProfit);
      setShowPop(true);
      setIsBetStarted(false);
      setVisibleImages(Array(25).fill(true));
      setTotalAmount((amt) => amt + betAmount + totalProfit);
      triggerCashAnimation();
      return;
    }
    if (betAmount > TotalAmount) {
      alert("Not enough balance!");
      return;
    }
    reset();
    setTotalAmount((amt) => amt - betAmount);
    const randomBombIndices = getRandomIndices(noOfBombs);
    setBombIndices(randomBombIndices);
    setTimeout(() => setIsBetStarted(true), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-10 px-4 text-white font-sans">
      <Loader />

      <div className="max-w-screen-xl m-auto rounded-2xl overflow-hidden shadow-2xl border border-[#334155]/40 bg-[#0f212e]/90 backdrop-blur-md">
        <div className="grid grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1 md:order-first order-last col-span-4 bg-gradient-to-b from-[#1e293b] to-[#0f172a] py-6 px-4 space-y-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent tracking-wide">
              💎 Mines Game
            </h2>

            <div className="flex flex-col gap-3">
              {/* Bet Input */}
              <div>
                <label htmlFor="betAmount" className="text-slate-400 text-sm font-medium">
                  Bet Amount
                </label>
                <div className="bg-[#1e293b] rounded-lg flex overflow-hidden border border-slate-600/60">
                  <input
                    disabled={isBetStarted}
                    id="betAmount"
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                    className="bg-transparent text-slate-100 py-2 px-3 font-semibold flex-1 focus:outline-none"
                  />
                  <div className="flex text-sm">
                    <button
                      disabled={isBetStarted}
                      onClick={() => setBetAmount((amt) => Math.max(amt / 2, 0))}
                      className="px-3 hover:bg-[#334155] transition"
                    >
                      ½
                    </button>
                    <button
                      disabled={isBetStarted}
                      onClick={() => setBetAmount((amt) => amt * 2)}
                      className="px-3 hover:bg-[#334155] transition"
                    >
                      2×
                    </button>
                  </div>
                </div>
              </div>

              {/* Mines or Stats */}
              {isBetStarted ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-sm">Mines</p>
                    <div className="bg-[#1e293b] px-2 py-1.5 rounded text-slate-100 font-medium">
                      {noOfBombs}
                    </div>
                    <p className="text-slate-400 text-sm mt-2">Gems Left</p>
                    <div className="bg-[#1e293b] px-2 py-1.5 rounded text-slate-100 font-medium">
                      {25 - noOfBombs - score.current}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-400 text-sm">Profit ({profitRatio.toFixed(2)}×)</p>
                    <div className="bg-[#1e293b] px-2 py-1.5 rounded flex justify-between items-center font-semibold">
                      <span>{totalProfit.toFixed(2)}</span>
                      <img className="w-4 h-4" src={ruppee} alt="Rs." />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="minesNo" className="text-slate-400 text-sm">
                    Mines
                  </label>
                  <select
                    id="minesNo"
                    name="minesNo"
                    value={noOfBombs}
                    disabled={isBetStarted}
                    onChange={(e) => setNoofBombs(parseInt(e.target.value))}
                    className="bg-[#1e293b] text-slate-100 mt-1 p-2 rounded w-full border border-slate-600/60"
                  >
                    {array.map((no) => (
                      <option key={no} value={no}>
                        {no}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Buttons */}
              <button
                onClick={handleBetClicked}
                className="w-full py-3 mt-4 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-lg transition"
              >
                {isBetStarted ? "Cashout" : "Bet"}
              </button>

              <button
                disabled
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 font-semibold flex items-center justify-center gap-1 shadow-inner"
              >
                Balance: {TotalAmount.toFixed(2)}
                <img src={ruppee} alt="Rs." className="inline w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Game Board */}
          <div className="md:col-span-3 col-span-4 m-auto sm:py-4 py-2 relative w-full xs:w-fit">
            <Popup hidden={!showPop} profitRatio={profitRatio.toFixed(2)} totalWin={sentBet.toFixed(2)} />
            {showCashAnimation && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg animate-bounce">
                +{sentBet.toFixed(2)} Rs
              </div>
            )}
            <LostPopup hidden={!showLostPop} />

            <div className="grid grid-cols-5 sm:gap-4 gap-2 px-2">
              {Array.from({ length: 25 }).map((_, index) => (
                <div
                  key={index}
                  onClick={(e) => handleClick(e, index)}
                  className={`sm:w-[6.5rem] sm:h-28 xs:w-[4.4rem] xs:h-[4.5rem] w-[3.8rem] h-[3.8rem] rounded-xl flex justify-center items-center shadow-md transition-all duration-300 ${
                    visibleImages[index]
                      ? "bg-gradient-to-br from-slate-700 to-slate-800"
                      : "cursor-pointer bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 hover:scale-105 border-b-4 border-slate-900"
                  }`}
                >
                  <img
                    src={bombIndices.includes(index) ? bomb2 : gem}
                    alt=""
                    className={`${visibleImages[index] ? "block" : "hidden"} sm:w-14 sm:h-14 w-8 h-8 opacity-80`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <audio ref={gemAudioRef} src={gemSound} preload="auto" />
    </div>
  );
}
