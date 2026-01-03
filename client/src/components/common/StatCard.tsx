interface StatCardProps {
  title: string;
  value: number;
  icon?: 'report' | 'sos' | 'shelter' | 'pending';
  color: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange';
  subtitle?: string;
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  const icons = {
    report: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
    sos: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    ),
    shelter: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    ),
    pending: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  };

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-xl sm:rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="p-4 sm:p-5">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0">
              <div className={`rounded-lg sm:rounded-xl ${colorClasses[color]} p-2 sm:p-3`}>
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {icons[icon]}
                </svg>
              </div>
            </div>
          )}
          <div className={`${icon ? 'ml-3 sm:ml-5' : ''} w-0 flex-1 min-w-0`}>
            <dl>
              <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1">{value}</dd>
              {subtitle && <dd className="text-xs text-gray-500 mt-1 truncate">{subtitle}</dd>}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
