# 🎬 VEO3 AI Prompt Enhancement

## 🚀 Что нового?

Добавили AI-powered функцию улучшения промптов для VEO3 Generator! Теперь твои промпты станут более профессиональными и детальными с **3 вариантами длины**.

## ⚡ Как работает?

1. **Создай базовый промпт** - используй наш визуальный конструктор
2. **Выбери длину enhancement** - Short (500), Medium (1000) или Long (2000 символов)
3. **Нажми "AI Enhance"** - ИИ улучшит твой промпт согласно VEO3 guidelines
4. **Копируй результат** - используй в VEO3 для лучших видео

## 🎯 Варианты длины

### 📝 Short (500 символов)
- Быстрое улучшение
- Основные детали
- Идеально для простых сцен

### 📄 Medium (1000 символов) 
- Сбалансированная детализация
- Профессиональные описания
- Рекомендуется для большинства случаев

### 📚 Long (2000 символов)
- Максимальная детализация
- Кинематографические описания
- Для сложных художественных сцен

## 🛠 Технологии

- **Vercel AI SDK** + **Azure OpenAI**
- **GPT-4o** для максимального качества
- **3-шаговый интерфейс** для удобства
- **VEO3 Guidelines** из официальной документации

## 📝 Примеры результатов

### Short Enhancement (451 символов)
**До:** `A coffee shop, woman reading, morning`

**После:** 
```
A cozy coffee shop in the soft morning light, a woman sits by the window reading a novel, steam rising from her mug. Cinematic, realistic style with a gentle slow pan across the scene. The main subject is the woman, absorbed in her book, framed by rustic wooden tables and shelves lined with pastries. Warm, golden sunlight filters in, creating a calm, inviting mood.
```

### Medium Enhancement (966 символов)
**После:**
```
In a cozy, sunlit coffee shop during the early morning, a woman sits alone at a small wooden table by the window, deeply engrossed in a novel. The scene captures the gentle bustle of the café as baristas prepare drinks in the background, steam rising from espresso machines. The camera begins with a slow, cinematic dolly-in from outside the window, passing through the glass to focus on the woman's serene expression and the soft turning of pages. Warm, golden morning light streams through the windows, casting long, inviting shadows and illuminating dust motes in the air, creating a tranquil and intimate mood. The background hums with the soft clatter of cups, quiet conversation, and mellow acoustic jazz music.
```

### Long Enhancement (2009 символов)
**После:**
```
A cozy, bustling coffee shop in the heart of a European city during the early morning hours. The scene opens with a gentle, cinematic tracking shot that glides through the entrance, capturing the warm, inviting atmosphere filled with the soft hum of conversation and the distant hiss of an espresso machine. The camera slowly moves past rustic wooden tables, sunlight streaming through large, slightly fogged windows, casting golden beams across the polished floor and illuminating floating dust motes. The main subject is a woman in her early thirties, dressed in a comfortable cream sweater and jeans, sitting alone at a corner table by the window. She is deeply engrossed in a hardcover novel, her expression serene and contemplative, occasionally pausing to sip from a steaming ceramic mug...
```

## 🎨 VEO3 Prompting Guidelines

Наш AI использует официальные VEO3 guidelines:

### Структура промпта:
1. **Scene Description** - общее описание происходящего
2. **Visual Style** - кинематографический стиль  
3. **Camera Movement** - движения камеры
4. **Main Subject** - главный объект фокуса
5. **Background Setting** - локация и окружение
6. **Lighting/Mood** - освещение и эмоциональный тон
7. **Audio Cue** - звуки и музыка
8. **Color Palette** - цветовая палитра

### Лучшие практики:
- ✅ Используй естественный язык
- ✅ Длинные промпты = лучший результат
- ✅ Будь четким и описательным
- ❌ Избегай кавычки для диалогов
- 🌍 Язык влияет на культурный контекст

## 🔧 Настройка

1. Создай `.env.local`:
```bash
AZURE_OPENAI_RESOURCE_NAME=your-resource-name
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
```

2. Установи зависимости:
```bash
pnpm install
```

3. Запусти dev сервер:
```bash
pnpm dev
```

## 📊 API Usage

```javascript
POST /api/enhance-prompt
{
  "prompt": "Your basic prompt",
  "length": "short" | "medium" | "long"
}

Response:
{
  "originalPrompt": "...",
  "enhancedPrompt": "...",
  "length": "medium", 
  "targetCharacters": 1000,
  "actualCharacters": 966
}
```

## 🎯 Результат

- **3 варианта длины** для любых потребностей
- **Профессиональные промпты** на основе VEO3 guidelines
- **Реальное время** - результат за секунды
- **Копирование в один клик** - готово к использованию
- **Отображение статистики** - контроль длины промпта

---

🔗 **Ссылки:**
- [VEO3 Generator](/en/tool/simple-veo3-generator)
- [Официальная документация VEO3](https://prompt.superduperai.co/)
- [GitHub Repository](https://github.com/fortunto2/superduperai-landing)

## 🎯 Для кого?

- **Контент-криэйторы** - профессиональные промпты за секунды
- **Видеомейкеры** - кинематографические описания  
- **Маркетологи** - качественный видеоконтент
- **Все остальные** - просто классные видео! 🎥

---

*Сделано с ❤️ командой SuperDuperAI* 