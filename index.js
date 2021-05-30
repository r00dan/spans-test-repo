;(function() {
    let totalCount = null;
    let remainingCount = null;
    let renderedCount = 0;
    const optimalPortion = 2_500;
    const body = document.body;
    const inputEl = body.querySelector('input');
    const resultEl = body.querySelector('.result');
    const renderedSpansEl = body.querySelector('.rendered-spans > span');
    const chunkSizeEl = body.querySelector('.chunk-size > span');
    const clearBtnEl = body.querySelector('.header > span > button');
    const IOAOptions = {
        threshold: 1
    };

    const init = () => {
        chunkSizeEl.innerHTML = optimalPortion;

        renderSpans();

        clearBtnEl.addEventListener('click', () => {
            resetAll();
        })
        
        inputEl.addEventListener('input', () => {
            try {
                if (getCurrentInputValue() < 0) throw new Error('You should enter only positive number!');

                totalCount = remainingCount = getCurrentInputValue();
                cleanResultBlock();
                resetRenderedCount();
                renderSpans();
            } catch (e) {
                alert(e);
                resetAll();
            }
        })
    }

    const resetAll = () => {
        resetRenderedCount();
        updateAndRenderRenderedSpansCount(0);
        resetInputValueToZero();
        cleanResultBlock();
    }

    const updateAndRenderRenderedSpansCount = value => {
        renderedCount += Number(value);
        renderedSpansEl.innerHTML = renderedCount;
    }

    const resetRenderedCount = () => {
        renderedCount = 0;
    }

    const calculateRemainingCount = () => {
        if (remainingCount < optimalPortion) {
            return remainingCount -= remainingCount;
        }
        return remainingCount -= optimalPortion;
    }

    const isTotalCountLessThanOptimalPortion = () => {
        if (totalCount > optimalPortion) {
            return false;
        } 
        else {
            return true;
        }
    }

    const resetInputValueToZero = () => {
        inputEl.value = 0;
    }

    const getCurrentInputValue = () => {
        return Number(inputEl.value);
    }

    const getRandomValueInRange = (max = 9) => {
        return Math.floor(Math.random() * max);
    }

    const createSpanElementWithRNG = () => {
        const span = document.createElement('span');
        span.innerHTML = getRandomValueInRange();
        resultEl.appendChild(span);
        return span;
    }

    const cleanResultBlock = () => {
        resultEl.innerHTML = null;
    }

    const renderSpans = () => {
        isTotalCountLessThanOptimalPortion() ? renderAllSpans() : renderPortionSpans(); 
    }

    const renderAllSpans = () => {
        let count = getCurrentInputValue();
        for ( let i = 0; i < count; i++ ) {
            createSpanElementWithRNG();
        }

        updateAndRenderRenderedSpansCount(count);
    }

    const renderPortionSpans = () => {
        let size = remainingCount < optimalPortion ? remainingCount : optimalPortion;
        calculateRemainingCount();

        for ( let i = 0; i < size; i++ ) {
            if (i === size - 1) {
                observer.observe(createSpanElementWithRNG())
            }
            else {
                createSpanElementWithRNG();
            }
        }

        if (size === 0) {
            document.querySelectorAll('.result > span').forEach(span => observer.unobserve(span))
        }

        updateAndRenderRenderedSpansCount(size);
    }

    const observer = new IntersectionObserver( entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                renderSpans();
            }
        })
    }, IOAOptions );

    init();
}());