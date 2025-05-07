
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

  const [boostActive, setBoostActive] = useState<boolean>(() => {
    const saved = localStorage.getItem("boostActive");
    return saved ? saved === "true" : false;
  });
  
  const [boostEndTime, setBoostEndTime] = useState<number>(() => {
    const saved = localStorage.getItem("boostEndTime");
    return saved ? parseInt(saved) : 0;
  });
  
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>("sber");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState<boolean>(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState<Array<{
    id: string;
    amount: number;
    date: string;
    bank: string;
    status: 'pending' | 'completed' | 'rejected';
  }>>(() => {
    const saved = localStorage.getItem("withdrawalHistory");
    return saved ? JSON.parse(saved) : [];
  });
  
  // Сохранение данных при их изменении
  useEffect(() => {
    localStorage.setItem("clicks", clicks.toString());
    localStorage.setItem("money", money.toString());
    localStorage.setItem("level", level.toString());
    localStorage.setItem("clickValue", clickValue.toString());
    localStorage.setItem("clicksToNextLevel", clicksToNextLevel.toString());
    localStorage.setItem("boostActive", boostActive.toString());
    localStorage.setItem("boostEndTime", boostEndTime.toString());
    localStorage.setItem("withdrawalHistory", JSON.stringify(withdrawalHistory));
  }, [clicks, money, level, clickValue, clicksToNextLevel, boostActive, boostEndTime, withdrawalHistory]);
  
  // Проверка активного бустера
  useEffect(() => {
    const checkBoost = () => {
      const now = Date.now();
      if (boostActive && now > boostEndTime) {
        setBoostActive(false);
        setClickValue(prev => parseFloat((prev / 2).toFixed(2)));
        toast({
          title: "Усиление закончилось",
          description: "Множитель клика вернулся к обычному значению.",
          variant: "destructive"
        });
      }
    };

    const timer = setInterval(checkBoost, 1000);
    return () => clearInterval(timer);
  }, [boostActive, boostEndTime]);

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
      
      toast({
        title: "Уровень повышен!",
        description: `Вы достигли уровня ${level + 1}! Стоимость клика увеличена в 1.5 раза.`
      });
    }
  };
  
  // Расчёт процента для прогресс-бара
  const progressPercentage = Math.min(100, (clicks / clicksToNextLevel) * 100);

  // Имитация покупки доната
  const handleDonate = (amount: number, benefit: string, duration?: number) => {
    toast({
      title: "Спасибо за поддержку!",
      description: `Ваш платеж на сумму ${amount} ₽ обрабатывается.`
    });

    // Здесь будет код для обработки платежа
    // В реальном приложении нужно интегрировать платежную систему

    // Применяем эффект от доната
    if (benefit === "boost") {
      const boostDuration = duration || 300000; // 5 минут по умолчанию
      const endTime = Date.now() + boostDuration;
      
      setBoostActive(true);
      setBoostEndTime(endTime);
      setClickValue(prev => parseFloat((prev * 2).toFixed(2))); // Удваиваем стоимость клика
      
      toast({
        title: "Усиление активировано!",
        description: `Стоимость клика удвоена на ${duration ? duration / 60000 : 5} минут.`
      });
    } else if (benefit === "money") {
      const bonusMoney = amount * 10; // получаем в 10 раз больше виртуальных денег
      setMoney(prev => parseFloat((prev + bonusMoney).toFixed(2)));
      
      toast({
        title: "Бонус получен!",
        description: `На ваш счет зачислено ${bonusMoney} ₽.`
      });
    } else if (benefit === "levelUp") {
      const levelsToAdd = Math.floor(amount / 100);
      if (levelsToAdd > 0) {
        setLevel(prev => prev + levelsToAdd);
        setClickValue(prev => parseFloat((prev * Math.pow(1.5, levelsToAdd)).toFixed(2)));
        
        toast({
          title: "Уровень повышен!",
          description: `Вы мгновенно получили ${levelsToAdd} ${levelsToAdd === 1 ? 'уровень' : 'уровня'}.`
        });
      }
    }
  };

  // Расчет времени до окончания буста
  const getBoostTimeRemaining = () => {
    if (!boostActive) return null;
    
    const remaining = Math.max(0, boostEndTime - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Форматирование номера карты
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Обработка изменения номера карты
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  // Обработка запроса на вывод средств
  const handleWithdrawalRequest = () => {
    const amountNum = parseFloat(withdrawalAmount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Ошибка",
        description: "Укажите корректную сумму для вывода",
        variant: "destructive"
      });
      return;
    }
    
    if (amountNum > money) {
      toast({
        title: "Недостаточно средств",
        description: "На вашем балансе недостаточно средств для вывода",
        variant: "destructive"
      });
      return;
    }
    
    if (cardNumber.length < 16 || cardNumber.replace(/\s+/g, '').length !== 16) {
      toast({
        title: "Ошибка",
        description: "Введите корректный номер карты (16 цифр)",
        variant: "destructive"
      });
      return;
    }
    
    // Списываем сумму с баланса
    setMoney(prev => parseFloat((prev - amountNum).toFixed(2)));
    
    // Добавляем запись в историю выводов
    const newWithdrawal = {
      id: `withdraw-${Date.now()}`,
      amount: amountNum,
      date: new Date().toISOString(),
      bank: selectedBank,
      status: 'pending' as const
    };
    
    setWithdrawalHistory(prev => [newWithdrawal, ...prev]);
    
    // Закрываем диалог
    setIsWithdrawalDialogOpen(false);
    
    // Сбрасываем форму
    setWithdrawalAmount("");
    setCardNumber("");
    
    // Показываем уведомление
    toast({
      title: "Заявка на вывод средств создана",
      description: `Сумма ${amountNum} ₽ будет переведена на вашу карту в течение 24 часов.`
    });
    
    // Имитация обработки запроса (в реальном приложении здесь был бы запрос к API)
    setTimeout(() => {
      setWithdrawalHistory(prev => 
        prev.map(item => 
          item.id === newWithdrawal.id 
            ? {...item, status: 'completed'} 
            : item
        )
      );
      
      toast({
        title: "Вывод средств выполнен",
        description: `Сумма ${amountNum} ₽ переведена на вашу карту ${selectedBank === 'sber' ? 'Сбербанк' : 'Тинькофф'}.`
      });
    }, 10000); // Имитация задержки в 10 секунд
  };

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
            {boostActive && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 mt-2">
                <Icon name="Zap" className="mr-1 h-3 w-3" />
                Бустер активен: {getBoostTimeRemaining()}
              </Badge>
            )}
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
          
          <CardFooter className="flex justify-between gap-2">
            <Dialog open={isWithdrawalDialogOpen} onOpenChange={setIsWithdrawalDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50">
                  <Icon name="CreditCard" className="mr-2 h-5 w-5" />
                  Вывести деньги
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Вывод средств</DialogTitle>
                  <DialogDescription>
                    Выберите банк и введите сумму для вывода. Минимальная сумма вывода: 100 ₽
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Сумма
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      min="100"
                      max={money}
                      placeholder="Сумма для вывода"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      Банк
                    </Label>
                    <RadioGroup 
                      className="col-span-3"
                      value={selectedBank}
                      onValueChange={setSelectedBank}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sber" id="sber" />
                        <Label htmlFor="sber" className="flex items-center">
                          <Icon name="Wallet" className="mr-2 h-4 w-4 text-green-600" />
                          Сбербанк
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tinkoff" id="tinkoff" />
                        <Label htmlFor="tinkoff" className="flex items-center">
                          <Icon name="CreditCard" className="mr-2 h-4 w-4 text-yellow-500" />
                          Тинькофф
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="card" className="text-right">
                      Номер карты
                    </Label>
                    <Input
                      id="card"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="col-span-3"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsWithdrawalDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleWithdrawalRequest}>
                    Вывести средства
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 border-green-500 text-green-600 hover:bg-green-50">
                  <Icon name="HeartHandshake" className="mr-2 h-5 w-5" />
                  Поддержать проект
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Поддержите разработчика</SheetTitle>
                  <SheetDescription>
                    Ваша поддержка помогает нам улучшать игру и добавлять новые функции!
                  </SheetDescription>
                </SheetHeader>
                
                <div className="grid gap-4 mt-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">Ускорение x2</CardTitle>
                      <CardDescription>Удвойте стоимость клика на время</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Ваши клики будут стоить в 2 раза больше на протяжении указанного времени.</p>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                      <Button onClick={() => handleDonate(50, "boost", 300000)} className="w-full bg-green-500 hover:bg-green-600">
                        5 минут - 50 ₽
                      </Button>
                      <Button onClick={() => handleDonate(100, "boost", 600000)} className="w-full bg-green-500 hover:bg-green-600">
                        10 минут - 100 ₽
                      </Button>
                      <Button onClick={() => handleDonate(250, "boost", 1800000)} className="w-full bg-green-500 hover:bg-green-600">
                        30 минут - 250 ₽
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">Мгновенные деньги</CardTitle>
                      <CardDescription>Получите виртуальную валюту сразу</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Конвертируйте реальные деньги в виртуальную валюту с выгодным курсом 1:10.</p>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                      <Button onClick={() => handleDonate(100, "money")} className="w-full bg-blue-500 hover:bg-blue-600">
                        1,000 ₽ - 100 ₽
                      </Button>
                      <Button onClick={() => handleDonate(250, "money")} className="w-full bg-blue-500 hover:bg-blue-600">
                        2,500 ₽ - 250 ₽
                      </Button>
                      <Button onClick={() => handleDonate(500, "money")} className="w-full bg-blue-500 hover:bg-blue-600">
                        5,000 ₽ - 500 ₽
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">Мгновенный уровень</CardTitle>
                      <CardDescription>Повысьте свой уровень без кликов</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Пропустите долгий процесс прокачки и получите мгновенные уровни.</p>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                      <Button onClick={() => handleDonate(100, "levelUp")} className="w-full bg-purple-500 hover:bg-purple-600">
                        1 уровень - 100 ₽
                      </Button>
                      <Button onClick={() => handleDonate(250, "levelUp")} className="w-full bg-purple-500 hover:bg-purple-600">
                        2 уровня - 250 ₽
                      </Button>
                      <Button onClick={() => handleDonate(500, "levelUp")} className="w-full bg-purple-500 hover:bg-purple-600">
                        5 уровней - 500 ₽
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <div className="text-xs text-center text-muted-foreground mt-4">
                    <p>Это демонстрационная версия. В реальном приложении здесь будет настоящая оплата.</p>
                    <p>Все транзакции безопасны и защищены.</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </CardFooter>
        </Card>
        
        {/* История выводов */}
        {withdrawalHistory.length > 0 && (
          <Card className="shadow-lg border-2 border-purple-100">
            <CardHeader>
              <CardTitle className="text-xl">История выводов</CardTitle>
              <CardDescription>Ваши запросы на вывод средств</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {withdrawalHistory.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <div className="font-medium">{withdrawal.amount.toFixed(2)} ₽</div>
                      <div className="text-sm text-gray-500">
                        {new Date(withdrawal.date).toLocaleDateString()} - {withdrawal.bank === 'sber' ? 'Сбербанк' : 'Тинькофф'}
                      </div>
                    </div>
                    <Badge 
                      variant={withdrawal.status === 'completed' ? 'default' : 
                             withdrawal.status === 'rejected' ? 'destructive' : 'outline'}
                      className={withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    >
                      {withdrawal.status === 'completed' ? 'Выполнен' : 
                       withdrawal.status === 'rejected' ? 'Отклонен' : 'В обработке'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Чем больше кликаете, тем больше зарабатываете!</p>
          <p>Каждый новый уровень увеличивает стоимость клика в полтора раза.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
