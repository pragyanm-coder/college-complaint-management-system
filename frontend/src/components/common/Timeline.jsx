import { formatDateTime } from '../../utils/formatters'
import './Tracking.css'

function Timeline({ updates }) {
  const ordered = [...updates].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <ol className="timeline">
      {ordered.map((item, index) => {
        const isLatest = index === ordered.length - 1
        return (
          <li
            key={`${item.date}-${index}`}
            className={`timeline-item ${item.type} ${isLatest ? 'latest' : ''}`}
          >
            <p className="timeline-date">{formatDateTime(item.date)}</p>
            {item.type === 'remark' ? (
              <div className="timeline-remark">
                <p className="timeline-author">Remark from {item.author}</p>
                <p>{item.text}</p>
              </div>
            ) : (
              <>
                <p className="timeline-text">{item.text}</p>
                <p className="timeline-author">by {item.author}</p>
              </>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default Timeline