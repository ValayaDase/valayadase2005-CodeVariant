const LeafSprig = ({ className = "" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 240 260"
    fill="none"
    className={className}
  >
    <path d="M26 236C74 186 123 126 203 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M65 192C28 184 18 158 27 134C54 142 73 158 65 192Z" fill="currentColor" fillOpacity=".38" />
    <path d="M65 192L31 140" stroke="currentColor" strokeOpacity=".55" strokeWidth="1.4" />
    <path d="M92 158C57 146 50 120 64 98C88 111 102 132 92 158Z" fill="currentColor" fillOpacity=".3" />
    <path d="M92 158L67 105" stroke="currentColor" strokeOpacity=".5" strokeWidth="1.4" />
    <path d="M120 122C95 97 103 72 124 58C141 81 144 105 120 122Z" fill="currentColor" fillOpacity=".34" />
    <path d="M120 122L125 64" stroke="currentColor" strokeOpacity=".5" strokeWidth="1.4" />
    <path d="M148 86C137 54 153 34 180 31C185 59 175 79 148 86Z" fill="currentColor" fillOpacity=".28" />
    <path d="M148 86L177 37" stroke="currentColor" strokeOpacity=".48" strokeWidth="1.4" />
    <path d="M86 170C99 137 122 119 151 108" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export default function BotanicalBackdrop() {
  return (
    <div aria-hidden="true" className="botanical-backdrop pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <LeafSprig className="botanical-sprig botanical-sprig-top absolute -right-14 -top-10 w-40 sm:-right-10 sm:-top-8 sm:w-56" />
      <LeafSprig className="botanical-sprig botanical-sprig-bottom absolute -bottom-14 -left-16 w-36 rotate-180 sm:-bottom-12 sm:-left-10 sm:w-52" />
    </div>
  );
}
