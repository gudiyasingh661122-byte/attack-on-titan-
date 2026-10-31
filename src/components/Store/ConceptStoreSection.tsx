import React, { useState } from 'react';
import { X, Play, Eye, Layers } from 'lucide-react';
import {
  CONCEPT_PRODUCTS,
  ConceptProduct,
  PRODUCT_CATEGORIES,
  ProductCategory,
} from '../../data/products';

interface ConceptStoreSectionProps {
  onJumpToVideoTimestamp: (seconds: number) => void;
}

const ProductSvgDiagram: React.FC<{ motif: ConceptProduct['svgMotif']; color: string }> = ({
  motif,
  color,
}) => {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className="h-14 w-14 opacity-80 transition-transform duration-300 group-hover:scale-110"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
    >
      {motif === 'coat' && (
        <>
          <path d="M38 22 L60 32 L82 22 L96 46 L84 54 L80 38 L80 98 L40 98 L40 38 L36 54 L24 46 Z" />
          <line x1="60" y1="32" x2="60" y2="98" strokeDasharray="3 3" />
        </>
      )}
      {motif === 'monolith' && (
        <>
          <path d="M24 94 L96 94 M32 86 L88 86" />
          <path d="M36 86 Q60 20 84 86" />
          <path d="M44 86 Q60 32 76 86" />
          <path d="M52 86 Q60 46 68 86" />
          <line x1="60" y1="22" x2="60" y2="86" />
        </>
      )}
      {motif === 'compendium' && (
        <>
          <rect x="28" y="20" width="64" height="80" />
          <line x1="38" y1="20" x2="38" y2="100" />
          <circle cx="64" cy="56" r="16" />
          <path d="M64 40 L64 72 M48 56 L80 56" />
        </>
      )}
      {motif === 'triptych' && (
        <>
          <rect x="18" y="26" width="24" height="68" />
          <rect x="48" y="26" width="24" height="68" />
          <rect x="78" y="26" width="24" height="68" />
          <path d="M24 34 L38 58 L54 48 L68 78 L94 62" strokeWidth="2" />
        </>
      )}
      {motif === 'vinyl' && (
        <>
          <circle cx="60" cy="60" r="36" />
          <circle cx="60" cy="60" r="24" strokeDasharray="6 4" />
          <circle cx="60" cy="60" r="8" />
        </>
      )}
      {motif === 'watch' && (
        <>
          <circle cx="60" cy="60" r="28" />
          <path d="M46 34 L50 16 L70 16 L74 34" />
          <path d="M46 86 L50 104 L70 104 L74 86" />
          <line x1="60" y1="60" x2="60" y2="42" />
          <line x1="60" y1="60" x2="74" y2="60" />
        </>
      )}
    </svg>
  );
};

export const ConceptStoreSection: React.FC<ConceptStoreSectionProps> = ({
  onJumpToVideoTimestamp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All Concepts');
  const [activeProduct, setActiveProduct] = useState<ConceptProduct | null>(null);
  const [selectedFinishIndex, setSelectedFinishIndex] = useState<number>(0);

  const filteredProducts =
    selectedCategory === 'All Concepts'
      ? CONCEPT_PRODUCTS
      : CONCEPT_PRODUCTS.filter((item) => item.category === selectedCategory);

  const parseTimestampFromRef = (refText: string): number => {
    if (refText.includes('00:25')) return 25.0;
    if (refText.includes('01:13')) return 73.5;
    if (refText.includes('00:17')) return 17.5;
    if (refText.includes('00:40')) return 40.5;
    if (refText.includes('00:31')) return 31.5;
    if (refText.includes('00:08')) return 8.5;
    return 29.0;
  };

  return (
    <section
      id="concept-store"
      aria-labelledby="concept-store-heading"
      className="mx-auto max-w-[1280px] px-6 py-24 lg:px-12"
    >
      {/* Section Header & Explicit Non-Commercial Disclosure */}
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
            <span>04. Portfolio Concept Showcase</span>
            <span aria-hidden="true">·</span>
            <span>Concept Store — Demonstration Only</span>
          </div>
          <h2
            id="concept-store-heading"
            className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F4F1EA] sm:text-4xl"
          >
            Concept Store — Demonstration Only
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#A39E93]">
            This section is a portfolio and interface design demonstration created to showcase
            e-commerce art direction, responsive product presentation, and interactive inspection
            flows. These items are conceptual design studies—not official Attack on Titan
            merchandise and not available for commercial purchase.
          </p>
        </div>

        {/* Interactive Category Filter Controls */}
        <div
          role="tablist"
          aria-label="Filter concept products by category"
          className="flex flex-wrap items-center gap-1.5 bg-[#111116] p-1.5 border border-white/10"
        >
          {PRODUCT_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={isSelected}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#070709] font-semibold'
                    : 'text-[#A39E93] hover:text-[#F4F1EA]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Product Grid */}
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="group flex flex-col justify-between border border-white/10 bg-[#0D0D12] transition-colors duration-200 hover:border-[#D4AF37]/50"
          >
            <div>
              {/* Visual Artwork Frame with Resilient Fallback + Technical SVG Motif */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-[#14141C]">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-95"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/35 to-transparent" />

                {/* Corner Technical Blueprint Emblem */}
                <div className="pointer-events-none absolute bottom-3 right-3 flex items-center justify-center bg-[#070709]/80 p-2 backdrop-blur-xs border border-white/10">
                  <ProductSvgDiagram motif={product.svgMotif} color={product.accentColor} />
                </div>
              </div>

              {/* Card Body — Zero-Pill Clean Metadata */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-[#A39E93]">
                  <span className="font-mono text-[#D4AF37]">{product.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Demonstration Concept</span>
                </div>

                <h3 className="mt-2.5 font-display text-xl font-semibold text-[#F4F1EA] group-hover:text-[#FEF08A] transition-colors">
                  {product.name}
                </h3>

                <p className="mt-1.5 text-xs font-medium text-[#D6D1C7]">{product.subtitle}</p>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#A39E93]">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Card Footer Action */}
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
              <span className="font-mono text-[11px] text-[#A39E93] tabular-nums">
                {product.videoPhaseRef}
              </span>

              <button
                type="button"
                onClick={() => {
                  setSelectedFinishIndex(0);
                  setActiveProduct(product);
                }}
                className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] transition-colors hover:text-[#FEF08A] focus-visible:outline-2 focus-visible:outline-[#D4AF37] whitespace-nowrap shrink-0"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Inspect Concept</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Product Concept Specification Modal */}
      {activeProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-concept-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-white/20 bg-[#0B0B10] p-6 text-[#F4F1EA] shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#A39E93]">
                  <span className="font-mono text-[#D4AF37]">{activeProduct.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeProduct.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeProduct.conceptNote}</span>
                </div>
                <h3
                  id="modal-concept-title"
                  className="mt-1 font-display text-2xl font-bold text-[#F4F1EA]"
                >
                  {activeProduct.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveProduct(null)}
                aria-label="Close concept preview modal"
                className="flex h-9 w-9 items-center justify-center border border-white/15 bg-white/5 text-[#D6D1C7] transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="relative overflow-hidden border border-white/10 bg-[#14141C]">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-[#070709]/90 px-3 py-1.5 font-mono text-[11px] text-[#D4AF37]">
                  {activeProduct.videoPhaseRef}
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm font-medium text-[#D6D1C7]">{activeProduct.subtitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#A39E93]">
                    {activeProduct.description}
                  </p>

                  {/* Interactive Material / Finish Variant Inspector */}
                  <div className="mt-5">
                    <div className="text-xs font-semibold text-[#F4F1EA]">
                      Design Study Finish Variant
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['Obsidian / Gold Path', 'Crimson Fracture', 'Raw Titanium'].map(
                        (finish, idx) => (
                          <button
                            key={finish}
                            type="button"
                            onClick={() => setSelectedFinishIndex(idx)}
                            className={`border px-2.5 py-1.5 text-xs transition-colors whitespace-nowrap shrink-0 ${
                              selectedFinishIndex === idx
                                ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#FEF08A]'
                                : 'border-white/15 text-[#A39E93] hover:border-white/35 hover:text-[#F4F1EA]'
                            }`}
                          >
                            {finish}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F1EA]">
                      <Layers className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span>Architectural & Material Specifications</span>
                    </div>
                    <ul className="mt-2.5 space-y-1.5 text-xs text-[#A39E93]">
                      {activeProduct.materialsAndSpecs.map((spec) => (
                        <li key={spec} className="flex items-start gap-2">
                          <span className="text-[#D4AF37]">·</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-3 font-mono text-xs text-[#D6D1C7]">
                    Dimensions: {activeProduct.dimensions}
                  </div>
                </div>

                {/* Non-Commercial Demonstration Notice & Video Sync Jump */}
                <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
                  <p className="text-xs text-[#A39E93]">
                    Portfolio Notice: Concept demonstration only. No checkout, payment processing,
                    or commercial orders are enabled.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const targetSec = parseTimestampFromRef(activeProduct.videoPhaseRef);
                        setActiveProduct(null);
                        onJumpToVideoTimestamp(targetSec);
                      }}
                      className="flex items-center gap-2 border border-[#D4AF37] bg-[#D4AF37]/20 px-4 py-2.5 text-xs font-semibold text-[#FEF08A] transition-colors hover:bg-[#D4AF37]/30 whitespace-nowrap shrink-0"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Watch Synchronized Scene in Reel</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveProduct(null)}
                      className="border border-white/15 px-4 py-2.5 text-xs font-medium text-[#D6D1C7] hover:border-white/35 hover:text-white whitespace-nowrap shrink-0"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
