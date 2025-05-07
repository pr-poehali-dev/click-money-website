
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [clicks, setClicks] = useState<number>(() => {
    const savedClicks = localStorage.getItem("clicks");
    return savedClicks ? parseInt(savedClicks) : 0;
  });
  
  const [money, setMoney] = useState<number>(() => {
    const savedMoney = localStorage.getItem("money");
    return savedMoney ? parseFloat(savedMoney) : 0;
  });
  
  const [level, setLevel] = useState<number>(() => {
    const savedLevel = localStorage.getItem("level");
    return savedLevel ? parseInt(savedLevel) : 1;
  });
  
  const [clickValue, setClickValue] = useState<number>(() => {
    const savedClickValue = localStorage.getItem("clickValue");
    return savedClickValue ? parseFloat(savedClickValue) : 0.01;
  });
  
  const [clicksToNextLevel, setClicksToNextLevel] = useState<number>(() => {
    const saved = localStorage.getItem("clicksToNextLevel");
    return saved ? parseInt(saved) : 100;
  });
  
  // Сохранение данных при их изменении
  useEffect(() => {
    localStorage.setItem("clicks", clicks.toString());
    localStorage.setItem("money", money.toString());
    localStorage.setItem("level", level.toString());
    localStorage.setItem("clickValue", clickValue.toString());
    localStorage.setItem("clicksToNextLevel", clicksToNextLevel.toString());
  }, [clicks, money, level, clickValue, clicksToNextLevel]);
  
  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    setMoney(prevMoney => {
      const newMoney = prevMoney + clickValue;
      return parseFloat(newMoney.toFixed(2));
    });
    
    // Проверка для повышения уровня
    if (newClicks >= clicksToNextLevel) {
      setLevel(prevLevel => prevLevel + 1);
      setClickValue(prevValue => parseFloat((prevValue * 1.5).toFixed(2)));
      setClicksToNextLevel(prevTarget => Math.floor(prevTarget * 1.8));
    }
  };
  
  // Расчёт процента для прогресс-бара
  const progressPercentage = Math.min(100, (clicks / clicksToNextLevel) * 100);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-purple-700">КликоДеньги</h1>
          <p className="text-gray-600">Зарабатывайте деньги за клики!</p>
        </div>
        
        <Card className="shadow-lg border-2 border-purple-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ваш баланс</CardTitle>
            <CardDescription>Уровень: {level}</CardDescription>
            <div className="mt-4 text-3xl font-bold text-green-600">{money.toFixed(2)} ₽</div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Прогресс до уровня {level + 1}</span>
                <span>{clicks}/{clicksToNextLevel} кликов</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="text-center">
              <p className="mb-2 text-gray-600">За каждый клик вы получаете:</p>
              <p className="text-2xl font-bold text-purple-600">{clickValue.toFixed(2)} ₽</p>
            </div>
            
            <Button 
              className="w-full h-20 text-xl transition-transform hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-500"
              onClick={handleClick}
            >
              <Icon name="MousePointerClick" className="mr-2 h-6 w-6" />
              КЛИКНУТЬ
            </Button>
            
            <div className="flex justify-center text-gray-500">
              <p>Всего кликов: {clicks}</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-center text-gray-500">
              Повышайте свой уровень, чтобы увеличить стоимость клика!
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Чем больше кликаете, тем больше зарабатываете!</p>
          <p>Каждый новый уровень увеличивает стоимость клика в полтора раза.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
