// Check if coming from suppliers page with materials
if (window.location.search.includes('from=suppliers')) {
    const groupCreationMaterials = localStorage.getItem('groupCreationMaterials');
    if (groupCreationMaterials) {
        const materials = JSON.parse(groupCreationMaterials);
        
        // Pre-fill the category based on first material
        if (materials.length > 0) {
            document.getElementById('groupCategory').value = materials[0].category;
        }
        
        // Clear the temp storage
        localStorage.removeItem('groupCreationMaterials');
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const createGroupBtn = document.getElementById('createGroupBtn');
    const createGroupBtn2 = document.getElementById('createGroupBtn2');
    const createGroupModal = document.getElementById('createGroupModal');
    const cancelCreateGroup = document.getElementById('cancelCreateGroup');
    const confirmCreateGroup = document.getElementById('confirmCreateGroup');
    const newGroupForm = document.getElementById('newGroupForm');
    const groupSearch = document.getElementById('groupSearch');
    const groupsContainer = document.querySelector('.grid.grid-cols-1'); // Updated selector
    
    // Sample groups data
    let groups = [
        {
            id: 1,
            name: 'Fresh Produce Co-op',
            category: 'vegetables',
            members: 8,
            status: 'Active',
            savings: '₹12,450',
            description: 'Collaborative group for purchasing fresh fruits and vegetables at wholesale prices.',
            created: '2 weeks ago'
        },
        {
            id: 2,
            name: 'Bakery Supplies',
            category: 'grains',
            members: 5,
            status: 'Negotiating',
            savings: '₹8,200',
            description: 'Group for bulk purchasing of flour, sugar, and other baking essentials.',
            created: '1 week ago'
        }
    ];
    
    // Event Listeners
    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', openCreateGroupModal);
    }
    
    if (createGroupBtn2) {
        createGroupBtn2.addEventListener('click', openCreateGroupModal);
    }
    
    if (cancelCreateGroup) {
        cancelCreateGroup.addEventListener('click', closeCreateGroupModal);
    }
    
    if (confirmCreateGroup) {
        confirmCreateGroup.addEventListener('click', createNewGroup);
    }
    
    if (groupSearch) {
        groupSearch.addEventListener('input', searchGroups);
    }
    
    // Functions
    function openCreateGroupModal() {
        createGroupModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCreateGroupModal() {
        createGroupModal.classList.add('hidden');
        document.body.style.overflow = '';
        newGroupForm.reset();
    }
    
    function createNewGroup() {
        const groupName = document.getElementById('groupName').value;
        const groupCategory = document.getElementById('groupCategory').value;
        const groupDescription = document.getElementById('groupDescription').value;
        
        if (!groupName || !groupCategory) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Create new group
        const newGroup = {
            id: groups.length + 1,
            name: groupName,
            category: groupCategory,
            members: 1,
            status: 'Forming',
            savings: '₹0',
            description: groupDescription || 'No description provided',
            created: 'Just now'
        };
        
        groups.unshift(newGroup);
        renderGroups();
        
        // Close modal and reset form
        closeCreateGroupModal();
        
        // Show success message
        alert(`Group "${groupName}" created successfully! Start inviting other vendors.`);
    }
    
    function searchGroups(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredGroups = groups.filter(group => 
            group.name.toLowerCase().includes(searchTerm) ||
            group.description.toLowerCase().includes(searchTerm) ||
            group.category.toLowerCase().includes(searchTerm)
        );
        renderGroups(filteredGroups);
    }
    
    function renderGroups(groupsToRender = groups) {
        if (!groupsContainer) return;
        
        groupsContainer.innerHTML = '';
        
        if (groupsToRender.length === 0) {
            groupsContainer.innerHTML = `
                <div class="col-span-3 text-center py-10 text-gray-400">
                    <i class="fas fa-users-slash text-4xl mb-3"></i>
                    <p>No groups found matching your search</p>
                </div>
            `;
            return;
        }
        
        groupsToRender.forEach(group => {
            const groupCard = document.createElement('div');
            groupCard.className = 'group-card bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all';
            
            // Get gradient colors based on category
            const gradientClasses = getGradientClasses(group.category);
            
            groupCard.innerHTML = `
                <div class="bg-gradient-to-r ${gradientClasses} p-4 text-white">
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-lg">${group.name}</h3>
                        <span class="text-xs bg-white ${getTextColor(group.category)} px-2 py-1 rounded-full">${group.status}</span>
                    </div>
                    <p class="text-sm ${getTextLightColor(group.category)} mt-1">${group.members} vendors • ${group.savings} saved</p>
                </div>
                <div class="p-6">
                    <p class="text-gray-600 mb-4">${group.description}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex -space-x-2">
                            ${generateMemberAvatars(group.members)}
                        </div>
                        <button class="group-action-btn px-3 py-1 ${getButtonColor(group.status)} text-white text-sm rounded-lg hover:${getButtonHoverColor(group.status)} transition">
                            ${getButtonText(group.status)}
                        </button>
                    </div>
                    <div class="mt-4 text-xs text-gray-500">
                        <i class="fas fa-clock mr-1"></i> Created ${group.created}
                    </div>
                </div>
            `;
            
            groupsContainer.appendChild(groupCard);
        });
    }
    
    // Helper functions for styling
    function getGradientClasses(category) {
        const gradients = {
            grains: 'from-amber-500 to-yellow-500',
            dairy: 'from-blue-500 to-indigo-500',
            vegetables: 'from-green-500 to-teal-500',
            spices: 'from-red-500 to-pink-500',
            meat: 'from-rose-500 to-fuchsia-500',
            default: 'from-indigo-500 to-purple-500'
        };
        return gradients[category] || gradients.default;
    }
    
    function getTextColor(category) {
        const colors = {
            grains: 'text-amber-500',
            dairy: 'text-blue-500',
            vegetables: 'text-green-500',
            spices: 'text-red-500',
            meat: 'text-rose-500',
            default: 'text-indigo-500'
        };
        return colors[category] || colors.default;
    }
    
    function getTextLightColor(category) {
        return getTextColor(category).replace('500', '200');
    }
    
    function getButtonColor(status) {
        const colors = {
            Active: 'bg-green-500',
            Negotiating: 'bg-yellow-500',
            Forming: 'bg-blue-500',
            default: 'bg-indigo-500'
        };
        return colors[status] || colors.default;
    }
    
    function getButtonHoverColor(status) {
        return getButtonColor(status).replace('500', '600');
    }
    
    function getButtonText(status) {
        const texts = {
            Active: 'View',
            Negotiating: 'Join',
            Forming: 'Invite',
            default: 'View'
        };
        return texts[status] || texts.default;
    }
    
    function generateMemberAvatars(count) {
        let avatars = '';
        const maxVisible = 3;
        const avatarUrls = [
            'https://randomuser.me/api/portraits/women/12.jpg',
            'https://randomuser.me/api/portraits/men/32.jpg',
            'https://randomuser.me/api/portraits/women/44.jpg',
            'https://randomuser.me/api/portraits/men/22.jpg',
            'https://randomuser.me/api/portraits/women/33.jpg'
        ];
        
        const visibleCount = Math.min(count, maxVisible);
        for (let i = 0; i < visibleCount; i++) {
            avatars += `<img class="w-8 h-8 rounded-full border-2 border-white" src="${avatarUrls[i]}" alt="">`;
        }
        
        if (count > maxVisible) {
            avatars += `<div class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">+${count - maxVisible}</div>`;
        }
        
        return avatars;
    }
    
    // Initial render
    renderGroups();
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === createGroupModal) {
            closeCreateGroupModal();
        }
    });
});