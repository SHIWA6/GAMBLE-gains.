import { useState, useRef, useEffect } from "react";
import Loader from "../secure/component/Loader";
import ruppee from "../assets/ruppee.svg";
import Popup from "../secure/component/Popup";
import clubs from "../assets/clubs.svg";
import hearts from "../assets/hearts.svg";
import spades from "../assets/spades.svg";
import diamonds from "../assets/diamonds.svg";
import { generateCard } from "../secure/hiloLogic";
import "./hilo.css";

export default function Hilo() {
  // ------------ STATE ------------
  const [totalAmount, setTotalamount] = useState(1000);
  const [betAmount, setBetAmount] = useState(0);
  const [isBetStarted, setIsBetStarted] = useState(false);

  const [currentCard, setCurrentCard] = useState(generateCard());
  const [nextCard, setNextCard] = useState(generateCard());

  const [showPop, setShowPop] = useState(false);
  const [totalProfitMul, setTotalProfitMul] = useState(1.0); // cumulative RETURN multiplier (1.0 means just your stake)
  const [lost, setLost] = useState(false);
  const [controlOpacity, setControlOpacity] = useState(false);
  const [recentCardsArray, setRecentCardsArray] = useState([
    {
      card: null, // filled after first render
      desc: "Start Card",
      isLost: false,
      isSkipped: false,
      isHigher: null,
    },
  ]);

  const cardRef = useRef(null);

  // ensure first element shows the actual start card after mount
  useEffect(() => {
    setRecentCardsArray((prev) => [
      {
        card: currentCard,
        desc: "Start Card",
        isLost: false,
        isSkipped: false,
        isHigher: null,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------ HELPERS ------------
  const computeMulHigher = (n) => (n === 1 ? 1.07 : parseFloat(((13 / (14 - n)) * 0.99).toFixed(2)));
  const computeMulLower = (n) => (n === 13 ? 1.07 : parseFloat(((13 / n) * 0.99).toFixed(2)));

  const addAnimation = () => {
    if (!cardRef.current) return;
    const cl = cardRef.current.classList;
    if (cl.contains("flick")) {
      cl.remove("flick");
      cl.add("flick2");
    } else {
      cl.remove("flick2");
      cl.add("flick");
    }
  };

  const pushHistory = ({ card, desc, isLost, isSkipped, isHigher }) => {
    setRecentCardsArray((arr) => [
      ...arr,
      { card, desc, isLost: !!isLost, isSkipped: !!isSkipped, isHigher: isHigher ?? null },
    ]);
    const elem = document.getElementById("dataScroll");
    if (elem) {
      requestAnimationFrame(() => {
        elem.scrollLeft = elem.scrollWidth;
      });
    }
  };

  const advanceCard = () => {
    addAnimation();
    const newCard = generateCard();
    setCurrentCard(nextCard);
    setNextCard(newCard);
  };

  // ------------ CARD UI ------------
  const Card = ({ card, small = false, lost = false, cardRef, isSkipped = false }) => {
    const [colorSrc, setColorSrc] = useState(null);
    const [cardNumber, setCardNumber] = useState("");
    const [textColor, setTextColor] = useState("text-[#1a2c38]");

    const smallCardref = useRef(null);

    useEffect(() => {
      if (!card) return;
      // number label
      switch (card.cardNumber) {
        case 1:
          setCardNumber("A");
          break;
        case 11:
          setCardNumber("J");
          break;
        case 12:
          setCardNumber("Q");
          break;
        case 13:
          setCardNumber("K");
          break;
        default:
          setCardNumber(card.cardNumber);
      }
      // suit & color
      switch (card.cardColor) {
        case 1:
          setColorSrc(hearts);
          setTextColor("text-[#e9113c]");
          break;
        case 2:
          setColorSrc(diamonds);
          setTextColor("text-[#e9113c]");
          break;
        case 3:
          setColorSrc(spades);
          setTextColor("text-[#1a2c38]");
          break;
        case 4:
          setColorSrc(clubs);
          setTextColor("text-[#1a2c38]");
          break;
        default:
          break;
      }
    }, [card]);

    return (
      <div
        ref={!small ? cardRef : smallCardref}
        className={`bg-white ${
          small
            ? `sm:w-[80px] sm:h-[126.4px] w-[40px] h-[64px] rounded-sm sm:m-0 mx-3 z-10 relative ${
                isSkipped ? "opacity-40" : ""
              }`
            : `w-[120px] h-[189.6px] rounded-md cursor-pointer z-10 shadow-md ${
                lost ? "flex border-8 border-[#e9113c]" : "border-0"
              }`
        }`}
      >
        <div
          className={`${textColor} flex flex-col items-center w-fit ${
            small ? "sm:gap-2 pl-1" : "gap-4 pl-3 pt-2"
          }`}
        >
          <span className={`font-bold ${small ? "sm:text-4xl text-lg" : "text-5xl"}`}>
            {cardNumber}
          </span>
          <img src={colorSrc ?? ""} className={`${small ? "w-[16px] sm:w-[38px]" : "w-[50px]"}`} alt="suit" />
        </div>
      </div>
    );
  };

  const CardBack = ({ small = false }) => {
    return (
      <div
        className={`${small ? "sm:w-[80px] sm:h-[126.4px] w-[40px] h-[64px]" : "w-[120px] h-[189.6px]"} rounded-md cursor-pointer shadow-md p-1 hidden sm:block`}
      >
        <div className="bg-[#007bff] rounded-md h-full flex justify-center items-center relative">
          <div className="bg-white w-1 h-1 rounded-full absolute top-2 left-2" />
          <div className="bg-white w-1 h-1 rounded-full absolute bottom-3 left-2" />
          <div className="bg-white w-1 h-1 rounded-full absolute top-2 right-2" />
          <div className="bg-white w-1 h-1 rounded-full absolute bottom-3 right-2" />
          <h1 className={`text-white font-pacifico -rotate-[60deg] ${small ? "sm:text-2xl text-lg" : "text-4xl"}`}>Satta</h1>
        </div>
      </div>
    );
  };

  // ------------ GAME ACTIONS ------------
  const handleHigher = () => {
    if (!isBetStarted) return;
    setControlOpacity(true);

    const win = currentCard.cardNumber <= nextCard.cardNumber; // Higher or Same
    if (win) {
      const mul = computeMulHigher(currentCard.cardNumber);
      const newMul = parseFloat((totalProfitMul * mul).toFixed(2));
      setTotalProfitMul(newMul);
      pushHistory({
        card: nextCard,
        desc: `${newMul.toFixed(2)}x`,
        isLost: false,
        isSkipped: false,
        isHigher: true,
      });
      advanceCard();
      setLost(false);
      setControlOpacity(false);
    } else {
      pushHistory({ card: nextCard, desc: "Lost", isLost: true, isSkipped: false, isHigher: true });
      setLost(true);
      setIsBetStarted(false);
      setControlOpacity(false);
      // reset for next round
    }
  };

  const handleLower = () => {
    if (!isBetStarted) return;
    setControlOpacity(true);

    const win = currentCard.cardNumber >= nextCard.cardNumber; // Lower or Same
    if (win) {
      const mul = computeMulLower(currentCard.cardNumber);
      const newMul = parseFloat((totalProfitMul * mul).toFixed(2));
      setTotalProfitMul(newMul);
      pushHistory({
        card: nextCard,
        desc: `${newMul.toFixed(2)}x`,
        isLost: false,
        isSkipped: false,
        isHigher: false,
      });
      advanceCard();
      setLost(false);
      setControlOpacity(false);
    } else {
      pushHistory({ card: nextCard, desc: "Lost", isLost: true, isSkipped: false, isHigher: false });
      setLost(true);
      setIsBetStarted(false);
      setControlOpacity(false);
    }
  };

  const handleSkip = () => {
    // Skip only makes sense mid-bet to reveal the next card without changing multiplier
    pushHistory({ card: nextCard, desc: "Skipped", isLost: false, isSkipped: true, isHigher: null });
    advanceCard();
  };

  const resetThings = () => {
    setRecentCardsArray([
      { card: currentCard, desc: "Start Card", isLost: false, isSkipped: false, isHigher: null },
    ]);
    setTotalProfitMul(1.0);
    setLost(false);
    setShowPop(false);
  };

  const handleBetClicked = () => {
    const stake = Number(betAmount);
    if (!isBetStarted) {
      // placing a bet
      if (Number.isNaN(stake) || stake <= 0) {
        alert("Enter a valid bet amount");
        return;
      }
      if (stake > totalAmount) {
        alert("Not enough money");
        return;
      }
      setTotalamount((amt) => parseFloat((amt - stake).toFixed(2)));
      setIsBetStarted(true);
      setControlOpacity(true);
      resetThings();
      setControlOpacity(false);
      return;
    }

    // cashout
    const payout = parseFloat((stake * totalProfitMul).toFixed(2));
    setTotalamount((amt) => parseFloat((amt + payout).toFixed(2)));
    setShowPop(true);
    setIsBetStarted(false);
  };

  // ------------ RENDER ------------
  return (  
  <div className="min-h-full pt-10 px-3 md:px-6 bg-[radial-gradient(1200px_600px_at_80%_-10%,#12334a_0%,transparent_60%),radial-gradient(900px_500px_at_10%_110%,#0e2a3b_0%,transparent_60%),linear-gradient(180deg,#0b1620,#0a1a24_40%,#08131b)] text-slate-200 font-['Poppins',ui-sans-serif,system-ui] antialiased selection:bg-emerald-400/20 selection:text-emerald-100">
    <Loader />

    <div className="grid grid-cols-4 h-full gap-3 md:gap-5">
      {/* LEFT PANEL */}
      <div className="md:col-span-1 md:order-first order-last col-span-4 bg-[#10232d]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        <div className="flex flex-col gap-3">
          <label htmlFor="betAmount" className="text-slate-300/90 text-[0.9rem] font-semibold tracking-wide">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(16,185,129,0.6)]" />
              Bet Amount
            </span>
          </label>

          <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-[#2a3e4a] to-[#223641] ring-1 ring-white/10 shadow-inner">
            <div className="flex bg-[#0f212e]/90 items-center grow pr-2">
              <input
                disabled={isBetStarted}
                id="betAmount"
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="bg-transparent text-slate-100/90 placeholder:text-slate-400 py-2.5 px-3 text-sm font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-emerald-400/50 w-full"
              />
              <img className="w-4 h-4 opacity-90" src={ruppee} alt="Rs." />
            </div>

            <div className="flex font-semibold text-slate-100 text-sm divide-x divide-white/10">
              <button
                disabled={isBetStarted}
                onClick={() => setBetAmount((amt) => (Number(amt || 0) / 2).toFixed(2))}
                className="w-1/2 px-4 py-2 hover:bg-white/5 active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
              >
                1/2
              </button>
              <button
                disabled={isBetStarted}
                onClick={() => setBetAmount((amt) => (Number(amt || 0) * 2).toFixed(2))}
                className="w-1/2 px-4 py-2 hover:bg-white/5 active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
              >
                2&times;
              </button>
            </div>
          </div>
        </div>

        {/* Desktop controls */}
        <div className="sm:flex flex-col gap-2.5 hidden mt-4">
          <button
            disabled={!isBetStarted}
            onClick={handleHigher}
            className="group bg-gradient-to-r from-[#294457] to-[#2f4553] text-slate-100 px-3 py-3.5 rounded-xl text-sm font-semibold shadow-[0_8px_30px_-10px_rgba(0,0,0,0.7)] flex justify-center items-center gap-2 ring-1 ring-white/10 hover:from-[#3a5e75] hover:to-[#557086] disabled:opacity-50 disabled:hover:from-[#294457] disabled:hover:to-[#2f4553] transition-all duration-200"
          >
            <span className="tracking-wide">
              {currentCard.cardNumber === 13 ? "" : "Higher"}
              {currentCard.cardNumber > 1 && currentCard.cardNumber < 13 ? " or " : " "}
              {currentCard.cardNumber === 1 ? "" : "Same"}
            </span>
            {currentCard.cardNumber !== 13 ? (
              <svg fill="currentColor" viewBox="0 0 64 64" className="svg-icon text-[#ffce00] w-4 drop-shadow-[0_0_10px_rgba(255,206,0,0.6)]">
                <path d="M32.271 17 9.201 40.071 16.128 47l16.145-16.145L48.418 47l6.93-6.929L32.275 17h-.005Z"></path>
              </svg>
            ) : (
              <svg fill="currentColor" viewBox="0 0 64 64" className="svg-icon text-[#ffce00] w-3.5 mt-0.5 drop-shadow-[0_0_10px_rgba(255,206,0,0.6)]">
                <path d="M0 15.365h64v11.428H0V15.365Zm0 21.842h64v11.428H0V37.207Z"></path>
              </svg>
            )}
            <span className="font-extrabold tabular-nums bg-emerald-400/10 text-emerald-300 px-2 py-1 rounded-md ring-1 ring-emerald-400/30">
              {currentCard.cardNumber === 1
                ? 92.31
                : parseFloat((((14 - currentCard.cardNumber) * 100) / 13).toFixed(2))}
              %
            </span>
          </button>

          <button
            disabled={!isBetStarted}
            onClick={handleLower}
            className="group bg-gradient-to-r from-[#2b3a6a] to-[#2f3a78] text-slate-100 px-3 py-3.5 rounded-xl text-sm font-semibold shadow-[0_8px_30px_-10px_rgba(0,0,0,0.7)] flex justify-center items-center gap-2 ring-1 ring-white/10 hover:from-[#3c4e8b] hover:to-[#4a3cb2] disabled:opacity-50 disabled:hover:from-[#2b3a6a] disabled:hover:to-[#2f3a78] transition-all duration-200"
          >
            <span className="tracking-wide">
              {currentCard.cardNumber === 1 ? "" : "Lower"}
              {currentCard.cardNumber > 1 && currentCard.cardNumber < 13 ? " or " : " "}
              {currentCard.cardNumber === 13 ? "" : "Same"}
            </span>
            {currentCard.cardNumber === 1 ? (
              <svg fill="currentColor" viewBox="0 0 64 64" className="svg-icon text-[#7F47FD] w-3.5 mt-0.5 drop-shadow-[0_0_10px_rgba(127,71,253,0.65)]">
                <path d="M0 15.365h64v11.428H0V15.365Zm0 21.842h64v11.428H0V37.207Z"></path>
              </svg>
            ) : (
              <svg fill="currentColor" viewBox="0 0 64 64" className="svg-icon text-[#7F47FD] w-4 drop-shadow-[0_0_10px_rgba(127,71,253,0.65)]">
                <path d="M32.271 49.763 9.201 26.692l6.928-6.93 16.145 16.145 16.144-16.144 6.93 6.929-23.072 23.07h-.005Z"></path>
              </svg>
            )}
            <span className="font-extrabold tabular-nums bg-indigo-400/10 text-indigo-300 px-2 py-1 rounded-md ring-1 ring-indigo-400/30">
              {currentCard.cardNumber === 13
                ? 92.31
                : parseFloat(((currentCard.cardNumber * 100) / 13).toFixed(2))}
              %
            </span>
          </button>

          <button
            disabled={!isBetStarted}
            onClick={handleSkip}
            className="bg-gradient-to-r from-[#2a3c48] to-[#2f4553] text-slate-100 px-3 py-3 rounded-xl text-sm font-semibold shadow-[0_8px_30px_-10px_rgba(0,0,0,0.7)] flex justify-center items-center gap-2 ring-1 ring-white/10 hover:from-[#3a5566] hover:to-[#557086] disabled:opacity-50 transition-all duration-150 active:scale-[0.98]"
          >
            <span className="tracking-wide">Skip Card</span>
            <svg fill="currentColor" viewBox="0 0 64 64" className="svg-icon w-3.5 mt-0.5 opacity-90">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="m0 49.74 7.793 7.794L33.328 32 7.793 6.466 0 14.259 17.74 32 0 49.74Zm30.672 0 7.793 7.794L64 32 38.465 6.466l-7.793 7.793L48.412 32 30.673 49.74Z"
              ></path>
            </svg>
          </button>
        </div>

        <button
          disabled={controlOpacity}
          onClick={handleBetClicked}
          className={`w-full rounded-xl py-3.5 mt-4 font-extrabold tracking-wide text-slate-900 shadow-[0_15px_40px_-10px_rgba(16,185,129,0.5)] ring-1 ring-emerald-300/50 bg-gradient-to-b from-emerald-400 to-emerald-500 hover:to-emerald-400 active:scale-[0.99] transition-all duration-300 ${
            controlOpacity ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isBetStarted ? "Cashout" : "Bet"}
        </button>
      </div>

      {/* RIGHT / TABLE */}
      <div className="md:col-span-3 col-span-4 w-full p-2 md:p-3 flex flex-col relative gap-2">
        <Popup
          hidden={!showPop}
          profitRatio={parseFloat(totalProfitMul).toFixed(2)}
          totalWin={parseFloat(Number(betAmount) * totalProfitMul).toFixed(2)}
        />

        <div className="grow flex justify-center items-center relative my-2">
          <div className="bg-white/5 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_10px_40px_-10px_rgba(0,0,0,0.6)] w-fit rounded-2xl p-1 ring-1 ring-white/10">
            <div className="bg-white/5 backdrop-blur-xl shadow-md w-fit rounded-2xl p-1 ring-1 ring-white/10">
              <div className="bg-white/5 backdrop-blur-xl shadow-md w-fit rounded-2xl p-1 ring-1 ring-white/10">
                <div className="bg-white/5 backdrop-blur-xl shadow-md w-fit rounded-2xl p-1 relative ring-1 ring-white/10">
                  <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden">
                    <CardBack lost={lost} />
                  </div>
                  <div className="bg-transparent w-fit rounded-2xl p-1 relative">
                    <button
                      disabled={!isBetStarted}
                      onClick={handleSkip}
                      className="bg-[#2f4553]/90 hover:bg-[#557086] active:bg-[#507086] w-fit absolute -top-5 -left-5 sm:right-[-1.25rem] sm:left-auto py-3 px-4 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] z-10 disabled:opacity-50 transition-colors duration-150 ring-1 ring-white/10"
                    >
                      <svg fill="white" viewBox="0 0 64 64" className="svg-icon w-3.5 mt-0.5">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="m0 49.74 7.793 7.794L33.328 32 7.793 6.466 0 14.259 17.74 32 0 49.74Zm30.672 0 7.793 7.794L64 32 38.465 6.466l-7.793 7.793L48.412 32 30.673 49.74Z"
                        ></path>
                      </svg>
                    </button>

                    <Card lost={lost} card={currentCard} cardRef={cardRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex flex-col justify-center items-center gap-3 ml-5 z-10 sm:hidden">
            <button
              disabled={!isBetStarted}
              onClick={handleHigher}
              className="bg-higherButton bg-no-repeat bg-auto w-[112px] h-[126.74px] flex flex-col text-[#453800] font-extrabold justify-center items-center disabled:opacity-50 active:opacity-75 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <span className="w-20 mt-5 tracking-wide">
                {currentCard.cardNumber === 13 ? "" : "Higher"}
                {currentCard.cardNumber > 1 && currentCard.cardNumber < 13 ? " or " : " "}
                {currentCard.cardNumber === 1 ? "" : "Same"}
              </span>
              <span className="tabular-nums">
                {currentCard.cardNumber === 1
                  ? 92.31
                  : parseFloat((((14 - currentCard.cardNumber) * 100) / 13).toFixed(2))}
                %
              </span>
            </button>

            <button
              disabled={!isBetStarted}
              onClick={handleLower}
              className="bg-lowerButton bg-no-repeat bg-auto w-[112px] h-[126.74px] flex flex-col text-white font-extrabold justify-center items-center disabled:opacity-50 active:opacity-75 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <span className="w-20 -mt-5 tracking-wide">
                {currentCard.cardNumber === 1 ? "" : "Lower"}
                {currentCard.cardNumber > 1 && currentCard.cardNumber < 13 ? " or " : " "}
                {currentCard.cardNumber === 13 ? "" : "Same"}
              </span>
              <span className="tabular-nums">
                {currentCard.cardNumber === 13
                  ? 92.31
                  : parseFloat(((currentCard.cardNumber * 100) / 13).toFixed(2))}
                %
              </span>
            </button>
          </div>

          <div className="absolute top-0 left-20 right-0 bottom-0 bg-bgHi bg-left bg-no-repeat sm:block hidden opacity-30 mix-blend-screen" />
          <div className="absolute top-0 right-2 left-0 bottom-0 bg-bgLoStacked bg-right bg-no-repeat block sm:hidden opacity-30 mix-blend-screen" />
        </div>

        {/* Profit preview boxes (desktop) */}
        <div className="m-2 flex flex-col gap-3">
          <div className="bg-[#0f212e]/70 rounded-2xl flex p-4 gap-4 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_8px_30px_-10px_rgba(0,0,0,0.7)]">
            <div className="sm:flex flex-col gap-2 w-full hidden">
              <label htmlFor="targetMul" className="text-slate-300/90 text-sm font-semibold tracking-wide">
                Profit Higher (
                {computeMulHigher(currentCard.cardNumber).toFixed(2)}
                <span className="font-extrabold">&times;</span>)
              </label>
              <div className="flex bg-[#152c38]/80 items-center pr-2 border-2 border-transparent hover:border-emerald-400/40 rounded-xl ring-1 ring-white/10 shadow-inner">
                <svg fill="currentColor" viewBox="0 0 64 64" className="svg-icon text-[#b1bad3] w-5 ml-2">
                  <path d="M64 32.8 32 .8l-32 32h16.234v30.4H47.78V32.8H64Z"></path>
                </svg>
                <input
                  disabled
                  value={(
                    Number(betAmount || 0) * (computeMulHigher(currentCard.cardNumber) - 1)
                  ).toFixed(2)}
                  id="targetMul"
                  className="bg-transparent text-slate-100 py-2 rounded-s text-sm font-semibold px-2 focus:outline-none w-full cursor-text tabular-nums"
                  type="number"
                />
                <img className="w-4 opacity-90" src={ruppee} alt="" />
              </div>
            </div>

            <div className="sm:flex flex-col gap-2 w-full hidden">
              <label htmlFor="roll" className="text-slate-300/90 text-sm font-semibold tracking-wide">
                Profit Lower (
                {computeMulLower(currentCard.cardNumber).toFixed(2)}
                <span className="font-extrabold">&times;</span>)
              </label>
              <div className="flex bg-[#152c38]/80 items-center pr-2 border-2 border-transparent hover:border-indigo-400/40 rounded-xl ring-1 ring-white/10 shadow-inner">
                <svg fill="currentColor" viewBox="0 0 64 64" className="svg-icon text-[#b1bad3] w-5 ml-2">
                  <path d="m0 31.199 32 32 32-32H47.78V.8H16.234v30.398H0Z"></path>
                </svg>
                <input
                  disabled
                  value={(
                    Number(betAmount || 0) * (computeMulLower(currentCard.cardNumber) - 1)
                  ).toFixed(2)}
                  id="roll"
                  className="bg-transparent text-slate-100 py-2 rounded-s text-sm font-semibold px-2 focus:outline-none w-full cursor-text tabular-nums"
                  type="number"
                />
                <img className="w-4 opacity-90" src={ruppee} alt="" />
              </div>
            </div>
          </div>

          {/* History */}
          <div id="dataScroll" className="bg-[#07131a]/80 rounded-2xl p-2 overflow-x-scroll flex w-full sm:gap-2 gap-[0.15rem] no-scroll ring-1 ring-white/10 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            {recentCardsArray.map((item, index) => (
              <div key={`${item.desc}-${index}`} className="relative flex flex-col items-center">
                {index !== 0 && (
                  <div className="bg-white h-fit w-fit p-2 rounded-md shadow shadow-slate-400 absolute top-2 sm:top-12 -left-5 z-20">
                    {item.isSkipped ? (
                      <svg fill="#ff9d00" viewBox="0 0 64 64" className="svg-icon w-3 sm:w-4">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="m0 49.74 7.793 7.794L33.328 32 7.793 6.466 0 14.259 17.74 32 0 49.74Zm30.672 0 7.793 7.794L64 32 38.465 6.466l-7.793 7.793L48.412 32 30.673 49.74Z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        fill={item.isLost ? "#e9113c" : "#00e701"}
                        viewBox="0 0 64 64"
                        className={`svg-icon w-3 sm:w-4 ${item.isHigher ? "rotate-180" : ""}`}
                      >
                        <path d="m32 47.377 24-24 8 8-32 32-32-32 8-8 24 24ZM.322.621h63.356v11.313H.322V.622Z"></path>
                      </svg>
                    )}
                  </div>
                )}

                <Card isSkipped={item.isSkipped} small card={item.card ?? currentCard} />
                <div
                  className={`sm:text-sm text-[0.70rem] ${
                    item.isLost ? "bg-[#e9113c] text-[#2f030c]" : "bg-[#00e701] text-[#013e01]"
                  } w-full rounded-md py-0.5 px-1 sm:font-extrabold font-bold text-center cursor-default tracking-wide shadow-[0_4px_12px_-6px_rgba(0,0,0,0.6)]`}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);


}
