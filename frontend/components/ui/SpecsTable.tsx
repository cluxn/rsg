import { SectionContainer } from '@/components/layout/SectionContainer';
import type { ProductSpec } from '@/lib/api';

interface SpecsTableProps {
  specs: ProductSpec[] | null | undefined;
}

export function SpecsTable({ specs }: SpecsTableProps) {
  if (!specs || specs.length === 0) return null;

  return (
    <SectionContainer noPadding className="pb-16 lg:pb-24">
      <h2 className="font-heading text-navy text-2xl font-semibold mb-6 pb-3 border-b border-navy/15">
        Specifications
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th scope="col" className="text-left font-heading text-navy text-sm uppercase tracking-wide px-4 py-3 bg-steel/5 w-2/5">
              Spec
            </th>
            <th scope="col" className="text-left font-body text-navy/60 text-sm uppercase tracking-wide px-4 py-3 bg-steel/5">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {specs.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-steel/5'}>
              <td className="font-heading text-navy font-semibold text-[15px] px-4 py-3 align-top">
                {row.label}
              </td>
              <td className="font-body text-navy/80 text-[15px] px-4 py-3 align-top">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionContainer>
  );
}
