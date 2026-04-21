document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesElement = document.getElementById('moves');
    const restartBtn = document.getElementById('restart-btn');
    const modalRestartBtn = document.getElementById('modal-restart-btn');
    const modal = document.getElementById('success-modal');
    const finalMovesElement = document.getElementById('final-moves');

    // 시니어에게 친숙하고 구분하기 쉬운 과일 이모지 (6종류, 총 12장)
    const emojis = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍊'];
    
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matchedPairs = 0;

    function initGame() {
        // Reset variables
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        moves = 0;
        matchedPairs = 0;
        movesElement.textContent = moves;
        
        // Hide modal
        modal.classList.add('hidden');
        
        // Clear board
        gameBoard.innerHTML = '';

        // Create and shuffle deck
        const deck = [...emojis, ...emojis];
        shuffleArray(deck);

        // Render cards
        deck.forEach((emoji, index) => {
            const cardElement = createCard(emoji, index);
            gameBoard.appendChild(cardElement);
        });

        cards = document.querySelectorAll('.card');
    }

    function createCard(emoji, index) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        // 접근성을 위해 aria-label 추가 가능
        card.setAttribute('aria-label', '카드');

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${emoji}</div>
            </div>
        `;

        card.addEventListener('click', flipCard);
        return card;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            // 첫 번째 카드 클릭
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        // 두 번째 카드 클릭
        secondCard = this;
        updateMoves();
        checkForMatch();
    }

    function updateMoves() {
        moves++;
        movesElement.textContent = moves;
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        // 매칭 성공 시 시각적 효과 부여를 위한 클래스
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        matchedPairs++;
        
        // 모든 짝을 맞췄을 때
        if (matchedPairs === emojis.length) {
            setTimeout(showSuccessModal, 800); // 애니메이션 볼 시간 제공
        }

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        // 시니어 분들이 확인하기 충분하도록 1.2초 정도 대기 후 뒤집음
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1200); 
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function showSuccessModal() {
        finalMovesElement.textContent = moves;
        modal.classList.remove('hidden');
    }

    // Event Listeners
    restartBtn.addEventListener('click', initGame);
    modalRestartBtn.addEventListener('click', initGame);

    // Initialize game on load
    initGame();
});
