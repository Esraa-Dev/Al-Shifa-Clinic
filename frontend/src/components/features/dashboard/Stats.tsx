import { Users, Calendar, TrendingUp, Clock } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: Users,
      label: 'إجمالي المرضى',
      value: '1,248',
      change: '+12%',
      trend: 'up',
      color: 'blue'
    },
    {
      icon: Calendar,
      label: 'مواعيد اليوم',
      value: '24',
      change: '+3',
      trend: 'up',
      color: 'green'
    },
    {
      icon: TrendingUp,
      label: 'الإيرادات',
      value: '₪12,480',
      change: '+8%',
      trend: 'up',
      color: 'purple'
    },
    {
      icon: Clock,
      label: 'متوسط الانتظار',
      value: '15 د',
      change: '-2 د',
      trend: 'down',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} من الشهر الماضي
                </p>
              </div>
              <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;