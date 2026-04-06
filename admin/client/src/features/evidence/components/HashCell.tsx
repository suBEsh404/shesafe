import { shortenHash } from '../../../utils/shortenHash'

export const HashCell = ({ hash }: { hash: string }) => {
  return <span className="hash">{shortenHash(hash)}</span>
}
