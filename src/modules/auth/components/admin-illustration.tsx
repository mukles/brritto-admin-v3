import type { CSSProperties } from 'react'
import { cn } from '@/shared/utils/cn'

const LOOP = 'transform-fill motion-reduce:animate-none'

type LimbProps = {
  d: string
  width?: number
  suckers?: [number, number][]
}

function Limb({ d, width = 14, suckers = [] }: LimbProps) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} strokeWidth={width + 6} className="stroke-mascot-line" />
      <path d={d} strokeWidth={width} className="stroke-mascot-body" />
      {suckers.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2.4} className="fill-mascot-shade" />
      ))}
    </g>
  )
}

const LOWER_TENTACLES = [
  {
    d: 'M128 186C100 204 70 210 52 198C40 190 46 176 58 180',
    suckers: [
      [98, 207],
      [78, 209],
      [60, 203],
    ] as [number, number][],
    origin: 'origin-top-right',
    delay: '0s',
  },
  {
    d: 'M146 194C132 222 108 232 88 226C76 222 78 210 90 212',
    suckers: [
      [122, 223],
      [101, 229],
    ] as [number, number][],
    origin: 'origin-top-right',
    delay: '-1.1s',
  },
  {
    d: 'M174 194C188 222 212 232 232 226C244 222 242 210 230 212',
    suckers: [
      [198, 223],
      [219, 229],
    ] as [number, number][],
    origin: 'origin-top-left',
    delay: '-2.2s',
  },
  {
    d: 'M192 186C220 204 250 210 268 198C280 190 274 176 262 180',
    suckers: [
      [222, 207],
      [242, 209],
      [260, 203],
    ] as [number, number][],
    origin: 'origin-top-left',
    delay: '-0.6s',
  },
]

const OPTIONS = [175, 189, 203]

function Check({ d, className }: { d: string; className?: string }) {
  return (
    <path
      d={d}
      fill="none"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    />
  )
}

function Pencil({ length = 50 }: { length?: number }) {
  return (
    <g strokeLinejoin="round" strokeWidth={3} className="stroke-mascot-outline">
      <rect x={-5} y={-length} width={10} height={8} rx={2} className="fill-mascot-cheek" />
      <rect x={-5} y={-length + 8} width={10} height={length - 20} className="fill-mascot-pencil" />
      <path d="M-5 -12L0 0l5-12z" className="fill-mascot-paper" />
      <path d="M-1.8 -4.3L0 0l1.8-4.3z" className="fill-mascot-outline" />
    </g>
  )
}

function TagBubble() {
  return (
    <g className="animate-mascot-float motion-reduce:animate-none">
      <path
        d="M28 8h44a14 14 0 0 1 14 14v8a14 14 0 0 1-14 14h-2l14 12-24-12H28a14 14 0 0 1-14-14v-8A14 14 0 0 1 28 8z"
        strokeWidth={3}
        strokeLinejoin="round"
        className="fill-mascot-paper stroke-mascot-line"
      />
      <g className="animate-admin-typing motion-reduce:hidden">
        {[38, 50, 62].map((cx, index) => (
          <circle
            key={cx}
            cx={cx}
            cy="26"
            r="3.2"
            style={{ animationDelay: `${index * 0.15}s` }}
            className="fill-mascot-shade animate-mascot-dot motion-reduce:animate-none"
          />
        ))}
      </g>
      <g className={cn('origin-center animate-admin-tag', LOOP)}>
        <rect
          x="20"
          y="16"
          width="60"
          height="20"
          rx="10"
          strokeWidth={2}
          className="fill-brand-200 stroke-mascot-line"
        />
        <circle cx="30" cy="26" r="4" className="fill-brand-500" />
        <text x="37.5" y="29.6" className="fill-mascot-line text-[10px] font-bold">
          Physics
        </text>
      </g>
    </g>
  )
}

function Pathway() {
  return (
    <g strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" className="stroke-mascot-line">
      <path
        d="M250 72Q256 50 272 48Q290 46 296 66"
        fill="none"
        className="stroke-mascot-book-dark"
        strokeWidth={4}
      />
      <path
        d="M250 72Q256 50 272 48Q290 46 296 66"
        fill="none"
        strokeWidth={4}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={0}
        className="stroke-success-500 animate-admin-trail motion-reduce:animate-none"
      />
      <circle cx="250" cy="72" r="8" className="fill-success-500" />
      <Check d="M246 72l3 3 5-5.5" className="stroke-mascot-paper" />
      <circle cx="272" cy="48" r="8" className="fill-mascot-paper" />
      <g className={cn('origin-center animate-admin-node-2', LOOP)}>
        <circle cx="272" cy="48" r="8" className="fill-success-500" />
        <Check d="M268 48l3 3 5-5.5" className="stroke-mascot-paper" />
      </g>
      <circle cx="296" cy="66" r="8" className="fill-mascot-paper" />
      <g className={cn('origin-center animate-admin-node-3', LOOP)}>
        <circle cx="296" cy="66" r="8" className="fill-success-500" />
        <Check d="M292 66l3 3 5-5.5" className="stroke-mascot-paper" />
      </g>
      <path
        d="M296 50v-7M309 58l6-3M312 72l6 2"
        fill="none"
        opacity={0}
        className="stroke-mascot-pencil animate-admin-rays motion-reduce:hidden"
      />
    </g>
  )
}

function ReviewSheet() {
  return (
    <g strokeWidth={3} strokeLinejoin="round" className="stroke-mascot-outline">
      <path d="M252 212L306 204L318 222L264 230Z" className="fill-mascot-shade" />
      <path d="M248 206L302 198L314 216L260 224Z" className="fill-mascot-paper" />
      <path d="M258 210L272 208M262 216L280 213" fill="none" strokeWidth={2} opacity={0.35} />
      <g transform="translate(286 210) rotate(-8)">
        <g className={cn('origin-center animate-admin-stamp-mark', LOOP)}>
          <rect
            x="-11"
            y="-7"
            width="22"
            height="14"
            rx="3"
            fill="none"
            strokeWidth={2.5}
            className="stroke-success-500"
          />
          <Check d="M-5 0l3 3 6-6" className="stroke-success-500" />
        </g>
      </g>
    </g>
  )
}

function Stamp() {
  return (
    <g
      transform="translate(258 206)"
      strokeWidth={3}
      strokeLinejoin="round"
      className="stroke-mascot-outline"
    >
      <circle cx="0" cy="-16" r="5.5" className="fill-mascot-pencil" />
      <rect x="-2.5" y="-11" width="5" height="6" className="fill-mascot-shade" />
      <rect x="-11" y="-5" width="22" height="9" rx="2.5" className="fill-mascot-body" />
      <rect x="-12" y="4" width="24" height="4" rx="1" className="fill-success-500" />
    </g>
  )
}

function StampingArm() {
  return (
    <g className={cn('animate-admin-stamp', LOOP)}>
      <Limb d="M214 156C236 158 252 170 258 184C262 192 256 198 250 192" width={13} />
      <Stamp />
    </g>
  )
}

function ThinkingArm() {
  return (
    <g className="animate-mascot-think origin-bottom-right transform-fill motion-reduce:animate-none">
      <g transform="translate(70 100) rotate(-14)">
        <Pencil length={46} />
      </g>
      <Limb d="M104 150C80 146 56 128 54 104C53 90 60 80 70 80C77 81 77 90 70 91" width={13} />
    </g>
  )
}

function Face() {
  return (
    <g>
      <g className="animate-mascot-blink origin-center transform-fill motion-reduce:animate-none">
        <g className="animate-mascot-read motion-reduce:animate-none">
          <ellipse cx="136" cy="116" rx="12" ry="14" className="fill-mascot-line" />
          <ellipse cx="184" cy="116" rx="12" ry="14" className="fill-mascot-line" />
          <circle cx="140" cy="111" r="4.5" className="fill-mascot-paper" />
          <circle cx="188" cy="111" r="4.5" className="fill-mascot-paper" />
          <circle cx="132" cy="122" r="2" className="fill-mascot-paper" />
          <circle cx="180" cy="122" r="2" className="fill-mascot-paper" />
        </g>
      </g>
      <g fill="none" strokeWidth={3.5} strokeLinecap="round" className="stroke-mascot-line">
        <path d="M123 96Q133 90 146 95M174 95Q187 90 197 96" />
        <path d="M152 137q8 8 16 0" />
      </g>
    </g>
  )
}

function Glasses() {
  return (
    <g strokeWidth={4} fill="none" strokeLinecap="round" className="stroke-mascot-line">
      <path d="M120 62L100 72M200 62L220 72" />
      <circle cx="136" cy="62" r="16" className="fill-mascot-paper" fillOpacity={0.5} />
      <circle cx="184" cy="62" r="16" className="fill-mascot-paper" fillOpacity={0.5} />
      <path d="M152 60Q160 54 168 60" />
      <path d="M127 55l6-4M175 55l6-4" strokeWidth={2.5} className="stroke-mascot-paper" />
    </g>
  )
}

function QuestionBook() {
  return (
    <g strokeWidth={3.5} strokeLinejoin="round" className="stroke-mascot-outline">
      <path
        d="M114 158Q136 148 160 153Q184 148 206 158L206 164Q184 154 160 159Q136 154 114 164Z"
        className="fill-mascot-paper"
      />
      <path
        d="M160 153Q182 141 204 151L204 157Q182 147 160 159Z"
        className="fill-mascot-paper animate-mascot-page origin-left transform-fill motion-reduce:hidden"
      />
      <path d="M112 162L160 157L160 212L116 216Z" className="fill-mascot-book" />
      <path d="M160 157L208 162L204 216L160 212Z" className="fill-mascot-book-dark" />
      <text x="124" y="184" className="fill-mascot-line stroke-none text-[16px] font-bold">
        Q
      </text>
      <path
        d="M122 194l30-3M123 202l24-2.4"
        fill="none"
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.35}
      />
      {OPTIONS.map((y) => (
        <g key={y}>
          <circle cx="171" cy={y} r="3.6" strokeWidth={2.5} className="fill-mascot-paper" />
          <path
            d={`M179 ${y}h17`}
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.35}
          />
        </g>
      ))}
      <g className={cn('origin-center animate-admin-tick', LOOP)}>
        <circle cx="171" cy="189" r="3.6" strokeWidth={2.5} className="fill-success-500" />
      </g>
    </g>
  )
}

function Body() {
  return (
    <g>
      <path
        d="M160 32C210 32 240 70 240 114C240 146 226 170 206 186C190 198 130 198 114 186C94 170 80 146 80 114C80 70 110 32 160 32Z"
        strokeWidth={5}
        className="fill-mascot-body stroke-mascot-line"
      />
      <path
        d="M96 150C110 178 140 190 160 190C180 190 210 178 224 150C214 172 190 186 160 186C130 186 106 172 96 150Z"
        className="fill-mascot-shade"
        opacity={0.6}
      />
      <ellipse
        cx="122"
        cy="72"
        rx="13"
        ry="8"
        transform="rotate(-35 122 72)"
        className="fill-mascot-paper"
        opacity={0.7}
      />
    </g>
  )
}

export function AdminIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 260"
      aria-hidden="true"
      className={cn('animate-props-in overflow-visible motion-reduce:animate-none', className)}
    >
      <ellipse
        cx="160"
        cy="238"
        rx="122"
        ry="10"
        className="fill-mascot-shade animate-mascot-shadow origin-center transform-fill motion-reduce:animate-none"
        opacity={0.45}
      />

      <Pathway />
      <TagBubble />
      <ReviewSheet />

      <g className="animate-mascot-breathe origin-bottom transform-fill motion-reduce:animate-none">
        {LOWER_TENTACLES.map(({ d, suckers, origin, delay }) => (
          <g
            key={d}
            style={{ '--sway-delay': delay } as CSSProperties}
            className={cn('animate-mascot-sway transform-fill motion-reduce:animate-none', origin)}
          >
            <Limb d={d} suckers={suckers} />
          </g>
        ))}
        <StampingArm />
        <ThinkingArm />
        <Body />
        <Glasses />
        <Face />
        <QuestionBook />
        <Limb d="M102 196C106 214 122 218 126 205" width={11} />
        <Limb d="M218 196C214 214 198 218 194 205" width={11} />
      </g>
    </svg>
  )
}
