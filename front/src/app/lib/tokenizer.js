class Tokenizer {
    constructor() {
        this.init();
    }

    async init() {
        const response = await fetch(`${window.location.origin}/rakutenma/model_ja.min.json`);
        const model = await response.json();
        this.rakutenma = new RakutenMA(model);
        this.rakutenma.featset = RakutenMA.default_featset_ja;
        this.rakutenma.hash_func = RakutenMA.create_hash_func(15);

        this.weightsMap = await fetch('/api/weights?action=getTokenWeights').then(res => res.json());

        this.weights = {};
        this.weightsMap.forEach(item => {
            this.weights[item.key] = item.value;
        });

        this.suggestionsCount = await fetch('/api/settings?action=getSettings')
            .then(res => res.json())
            .then(settings => {
                const suggestionsCountSetting = settings.find(setting => setting.key === 'suggestionsCount');
                return suggestionsCountSetting ? suggestionsCountSetting.value : 5;
            });
    }

    tokenize(text) {
        const tokens = this.rakutenma.tokenize(text);
        return tokens;
    }

    filterTokens(tokens) {
        return tokens.filter(([token, tag]) => this.weights[tag] > 0);
    }

    calculateScore(tokenizedInput, tokenizedQuestion) {
        let score = 0;

        const inputTokens = new Set(tokenizedInput.map(([token, tag]) => token));

        for (const [questionToken, questionTag] of tokenizedQuestion) {
            if (inputTokens.has(questionToken)) {
                const weight = this.weights[questionTag] || 0;
                score += weight;
            }
        }

        return score;
    }

    async filterSuggestions(prompts, tokenizedInput) {

        if (prompts.length === 0) return prompts;

        const tokenizedPrompts = prompts.map(prompt => ({
            ...prompt,
            tokens: this.tokenize(prompt.prompt)
        }));

        const rankedPrompts = tokenizedPrompts.map(prompt => {
            const score = this.calculateScore(tokenizedInput, prompt.tokens);
            return { prompt: prompt.prompt, answer: prompt.answer, score: score };
        });

        rankedPrompts.sort((a, b) => b.score - a.score);

        // Return the top 5 suggestions
        const suggestions = rankedPrompts.slice(0, this.suggestionsCount).map(prompt => ({ prompt: prompt.prompt, answer: prompt.answer }));

        return suggestions;
    }

    async findBestMatch(prompts, tokenizedInput) {
        if (prompts.length === 0) return 'その質問に対する答えはわかりません。';

        const tokenizedPrompts = prompts.map(prompt => ({
            ...prompt,
            tokens: this.tokenize(prompt.prompt)
        }));

        const rankedPrompts = tokenizedPrompts.map(prompt => {
            const score = this.calculateScore(tokenizedInput, prompt.tokens);
            return { prompt: prompt.prompt, score: score };
        });

        rankedPrompts.sort((a, b) => b.score - a.score);

        const bestMatch = rankedPrompts[0];
        const answer = prompts.find(prompt => prompt.prompt === bestMatch.prompt).answer;

        return answer ? answer : 'その質問に対する答えはわかりません。';
    }
}

export default Tokenizer;