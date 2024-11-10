export function Footer() {
  return (
    <footer className="bg-[#1c1b1f] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="text-xl font-bold mb-4 md:mb-0">FreeHunter</div>
          <nav className="flex flex-col md:flex-row gap-4 md:gap-8">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Вакансии
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Для работодателя
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Для сотрудника
            </a>
          </nav>
        </div>
        <div className="h-px bg-gray-800 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-400">
          <div>2024 FreedomHunter. Все права защищены</div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Политика Конфиденциальности
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
